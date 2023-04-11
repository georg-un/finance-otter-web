import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/entity/user';
import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { Purchase } from '../../../core/entity/purchase';
import { IdGeneratorService } from '../../../core/id-generator.service';
import { DistributionFragment } from '../distribution-fragment';
import { FullscreenDialogService } from '../../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from '../../../layout/layout.service';
import { Location } from '@angular/common';
import { ReceiptProcessorService } from '../../receipt-processor/receipt-processor.service';
import { AbstractPurchaseEditor } from './abstract-purchase-editor';
import { Store } from '@ngxs/store';
import { PurchaseActions, UserState } from '@fino/store';

@Component({
  selector: 'app-editor-new',
  templateUrl: './purchase-editor.component.html',
  styleUrls: [
    '../payment-editor.component.scss',
    './purchase-editor.component.scss'
  ]
})
export class PurchaseEditorNewComponent extends AbstractPurchaseEditor implements OnInit {

  // TODO: Add validation before upload
  // FIXME: If this page is opened as first page, the user data is not yet loaded and an error is thrown

  public customDistribution = false;

  constructor(
    fullscreenDialog: FullscreenDialogService,
    snackBar: MatSnackBar,
    dialog: MatDialog,
    layoutService: LayoutService,
    location: Location,
    idGeneratorService: IdGeneratorService,
    private store: Store,
    private receiptProcessorService: ReceiptProcessorService
  ) {
    super(fullscreenDialog, snackBar, dialog, layoutService, location, idGeneratorService);
  }

  ngOnInit() {
    this.purchase = {} as Purchase;

    this.store.select(UserState.selectCurrentUser()).pipe(
      filter(Boolean),
      takeUntil(this.onDestroy$)
    ).subscribe((currentUser: User) => {
      this.purchase.buyerId = currentUser.userId;
    });

    this.users$
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      )
      .subscribe((users: User[]) => {
        users.forEach((user: User) => {
          this.distributionFragments.push(
            DistributionFragment.fromUser(user)
          );
        });
      });

    this.receipt$ = of(this.receiptProcessorService.receipt);
  }

  onViewReceiptClick(): void {
    if (this.receiptProcessorService.receipt) {
      this.fullscreenDialog.openReceiptViewDialog(this.receipt$, false);
    }
  }

  submitPurchase(): void {
    if (!this.customDistribution) {
      this.distributeToAllFields();
    }
    if (!this.isPurchaseValid(true)) {
      return;
    }
    this.idGeneratorService.generatePurchaseId()
      .pipe(take(1))
      .subscribe((purchaseId: string) => {
        if (purchaseId) {
          this.purchase.purchaseId = purchaseId;
          this.mapDistributionFragmentsToPurchaseDebits();
          this.store.dispatch(new PurchaseActions.AddNewPurchase({
            purchase: this.purchase,
            receipt: this.receiptProcessorService.receipt
          }));
        } else {
          this.snackBar.open('Ooops, something went wrong.');
        }
      });
  }
}
