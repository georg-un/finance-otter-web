import { Component, OnInit } from '@angular/core';
import { User } from '../core/entity/user';
import { MatSlideToggleChange } from '@angular/material';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { Purchase } from '../core/entity/purchase';
import { IdGeneratorService } from '../core/id-generator.service';
import { Debit } from '../core/entity/debit';
import { PurchaseEditorService } from './purchase-editor.service';
import { PurchaseActions } from '../store/actions/purchase.actions';
import { UserSelectors } from '../store/selectors/user.selectors';
import { AbstractEditor } from './abstract-purchase-editor';
import { DistributionFragment } from './distribution-fragment';

@Component({
  selector: 'app-editor-new',
  templateUrl: './purchase-editor.component.html',
  styleUrls: ['./purchase-editor.component.scss']
})
export class PurchaseEditorNewComponent extends AbstractEditor implements OnInit {

  // TODO: Add animation to slide custom debit fields in and out
  // TODO: Add validation before upload
  // FIXME: If this page is opened as first page, the user data is not yet loaded and an error is thrown
  customDistribution = false;

  constructor(protected store: Store<AppState>,
              protected editorService: PurchaseEditorService,
              private idGeneratorService: IdGeneratorService) {
    super(store, editorService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.purchase = new Purchase();

    this.store.select(UserSelectors.selectCurrentUser)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentUser: User) => {
        this.purchase.buyerId = currentUser.userId;
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

  submitPurchase(): void {
    if (!this.isPurchaseValid()) {
      return;
    }
    this.generatePurchase();
    this.store.dispatch(
      PurchaseActions.addNewPurchase({
        purchase: this.purchase
      })
    );
  }

  generatePurchase(): void {
    const purchaseId = this.idGeneratorService.generateId();
    this.purchase.purchaseId = purchaseId;
    this.purchase.debits = [];
    this.distributionFragments.forEach(distributionFragment => {
      this.purchase.debits.push(
        new Debit({
          transactionId: purchaseId,
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