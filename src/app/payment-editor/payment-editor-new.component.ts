import { Component, OnInit } from '@angular/core';
import { User } from '../core/rest-service/entity/user';
import { MatSlideToggleChange } from '@angular/material';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { Payment } from '../core/rest-service/entity/payment';
import { IdGeneratorService } from '../core/id-generator.service';
import { Debit } from '../core/rest-service/entity/debit';
import { PaymentEditorService } from './payment-editor.service';
import { PaymentActions } from '../store/actions/payment.actions';
import { UserSelectors } from '../store/selectors/user.selectors';
import { AbstractEditor } from './abstract-payment-editor';
import { DistributionFragment } from './distribution-fragment';

@Component({
  selector: 'app-editor-new',
  templateUrl: './payment-editor.component.html',
  styleUrls: ['./payment-editor.component.scss']
})
export class PaymentEditorNewComponent extends AbstractEditor implements OnInit {

  // TODO: Add animation to slide custom debit fields in and out
  // TODO: Add validation before upload
  // FIXME: If this page is opened as first page, the user data is not yet loaded and an error is thrown
  customDistribution = false;

  constructor(protected store: Store<AppState>,
              protected editorService: PaymentEditorService,
              private idGeneratorService: IdGeneratorService) {
    super(store, editorService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.payment = new Payment();

    this.store.select(UserSelectors.selectCurrentUser)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentUser: User) => {
        this.payment.userId = currentUser.userId;
      });

    this.users$
      .pipe(take(1))
      .subscribe((users: User[]) => {
        users.forEach((user: User) => {
          this.distributionFragments.push(
            DistributionFragment.fromUser(user)
          );
        });
      });
  }

  submitPayment(): void {
    if (!this.isPaymentValid()) {
      return;
    }
    this.generatePayment();
    this.store.dispatch(
      PaymentActions.addNewPayment({
        payment: this.payment
      })
    );
  }

  generatePayment(): void {
    const paymentId = this.idGeneratorService.generateId();
    this.payment.paymentId = paymentId;
    this.payment.debits = [];
    this.distributionFragments.forEach(distributionFragment => {
      this.payment.debits.push(
        new Debit({
          transactionId: paymentId,
          debitId: this.idGeneratorService.generateId(),
          debtorId: distributionFragment.user.userId,
          amount: distributionFragment.amount
        })
      );
    });
  }

  onDistributionToggleChange(change: MatSlideToggleChange): void {
    this.customDistribution = change.checked;
  }

}
