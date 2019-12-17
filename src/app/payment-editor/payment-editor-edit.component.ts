import { Component, Input, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { Payment } from '../core/rest-service/entity/payment';
import { PaymentEditorService } from './payment-editor.service';
import { PaymentActions } from '../store/actions/payment.actions';
import { AbstractEditor } from './abstract-payment-editor';
import { PaymentSelectors } from '../store/selectors/payment.selectors';
import { UserSelectors } from '../store/selectors/user.selectors';
import { User } from '../core/rest-service/entity/user';
import { combineLatest } from 'rxjs';
import { Debit } from '../core/rest-service/entity/debit';
import { DistributionFragment } from './distribution-fragment';

@Component({
  selector: 'app-payment-editor-edit',
  templateUrl: './payment-editor.component.html',
  styleUrls: ['./payment-editor.component.scss']
})
export class PaymentEditorEditComponent extends AbstractEditor implements OnInit {

  // TODO: Add animation to slide custom debit fields in and out
  // TODO: Add validation before upload
  // FIXME: If this page is opened as first page, the user data is not yet loaded and an error is thrown
  customDistribution = true;

  constructor(protected store: Store<AppState>,
              protected editorService: PaymentEditorService) {
    super(store, editorService);
  }

  ngOnInit() {
    super.ngOnInit();

    const payment$ = this.store.select(PaymentSelectors.selectCurrentPayment);
    const users$ = this.store.select(UserSelectors.selectAllUsers);

    combineLatest([payment$, users$])
      .pipe(take(1))
      .subscribe(([payment, users]: [Payment, User[]]) => {
        // Set payment from store
        this.payment = Object.assign({}, payment);
        this.date = new Date(this.payment.date);
        // Check if payment contains debits from inexistent users
        const paymentUserIds = this.payment.debits.map(debit => debit.debtorId);
        const allUserIds = users.map(user => user.userId);
        if (paymentUserIds.some(userId => !allUserIds.includes(userId))) {
          console.error('Payment contains a userId that doesn\'t exist.');
          return;
        }
        // Generate distribution fragments by debit
        this.payment.debits.forEach((debit: Debit) => {
          this.distributionFragments.push(
            DistributionFragment.fromDebit(
              debit,
              users.find(u => u.userId === debit.debtorId)
            )
          );
        });
      });
  }

  submitPayment(): void {
    if (!this.isPaymentValid()) {
      return;
    }
    this.store.dispatch(
      PaymentActions.addNewPayment({  // FIXME: Add action to update remote payment.
        payment: this.payment
      })
    );
  }

  onDistributionToggleChange(change: MatSlideToggleChange): void {
    this.customDistribution = change.checked;
  }

}
