import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store/states/app.state';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Purchase } from '../../../core/entity/purchase';
import { PurchaseActions } from '../../../store/actions/purchase.actions';
import { PurchaseSelectors } from '../../../store/selectors/purchase.selectors';
import { UserSelectors } from '../../../store/selectors/user.selectors';
import { User } from '../../../core/entity/user';
import { combineLatest } from 'rxjs';
import { Debit } from '../../../core/entity/debit';
import { DistributionFragment } from '../distribution-fragment';
import { IdGeneratorService } from '../../../core/id-generator.service';
import { FinOBackendService } from '../../../core/fino-backend.service';
import { FullscreenDialogService } from '../../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { BigNumber } from 'bignumber.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from '../../../layout/layout.service';
import { Location } from '@angular/common';
import { cloneDeep } from 'lodash-es';
import { AbstractPurchaseEditor } from './abstract-purchase-editor';

@Component({
  selector: 'app-purchase-editor-edit',
  templateUrl: './purchase-editor.component.html',
  styleUrls: [
    '../payment-editor.component.scss',
    './purchase-editor.component.scss'
  ]
})
export class PurchaseEditorEditComponent extends AbstractPurchaseEditor implements OnInit {

  // TODO: Add validation before upload
  // FIXME: If this page is opened as first page, the user data is not yet loaded and an error is thrown

  constructor(
    store: Store<AppState>,
    fullscreenDialog: FullscreenDialogService,
    snackBar: MatSnackBar,
    dialog: MatDialog,
    layoutService: LayoutService,
    location: Location,
    idGeneratorService: IdGeneratorService,
    private finoBackendService: FinOBackendService,
  ) {
    super(store, fullscreenDialog, snackBar, dialog, layoutService, location, idGeneratorService);
  }

  ngOnInit() {
    super.ngOnInit();

    const purchase$ = this.store.select(PurchaseSelectors.selectCurrentPurchase);
    const users$ = this.store.select(UserSelectors.selectAllUsers);

    combineLatest([purchase$, users$])
      .pipe(take(1))
      .subscribe(([purchase, users]: [Purchase, User[]]) => {
        // Set purchase from store
        this.purchase = cloneDeep(purchase);
        this.date = new Date(this.purchase.date);
        // Set sumAmount from debits
        this.sumAmount = this.purchase.debits
          .map(debit => debit.amount)
          .map(amount => new BigNumber(amount))
          .reduce((sum: BigNumber, curr: BigNumber) => sum.plus(curr), new BigNumber(0))
          .toNumber();
        // Check if purchase contains debits from inexistent users
        const purchaseUserIds = this.purchase.debits.map(debit => debit.debtorId);
        const allUserIds = users.map(user => user.userId);
        if (purchaseUserIds.some(userId => !allUserIds.includes(userId))) {
          console.error('Purchase contains a userId that doesn\'t exist.');
          return;
        }
        // Generate distribution fragments by debit
        this.purchase.debits.forEach((debit: Debit) => {
          this.distributionFragments.push(
            DistributionFragment.fromDebit(
              debit,
              users.find(u => u.userId === debit.debtorId)
            )
          );
        });
        // Generate distribution fragments for all users without a debit
        allUserIds.filter(userId => !purchaseUserIds.includes(userId)).forEach(
          (userId) => {
            this.distributionFragments.push(
              DistributionFragment.fromUser(users.find(u => u.userId === userId))
            );
          }
        );
      });

    // Fetch receipt
    this.receipt$ = this.finoBackendService.fetchReceipt(this.purchase.purchaseId);
  }

  onViewReceiptClick(): void {
    this.fullscreenDialog.openReceiptViewDialog(this.receipt$, false);
  }

  submitPurchase(): void {
    if (!this.customDistribution) {
      this.distributeToAllFields();
    }
    if (!this.isPurchaseValid(true)) {
      return;
    }
    this.mapDistributionFragmentsToPurchaseDebits();
    this.store.dispatch(
      PurchaseActions.updatePurchase({
        purchase: this.purchase
      })
    );
  }
}
