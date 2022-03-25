import { AbstractPaymentEditor } from '../abstract-payment-editor';
import { Debit } from '../../../core/entity/debit';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/states/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { IdGeneratorService } from '../../../core/id-generator.service';
import { FullscreenDialogService } from '../../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { LayoutService } from '../../../layout/layout.service';
import { Location } from '@angular/common';

export abstract class AbstractPurchaseEditor extends AbstractPaymentEditor {

  public abstract customDistribution: boolean;

  protected constructor(
    store: Store<AppState>,
    fullscreenDialog: FullscreenDialogService,
    snackBar: MatSnackBar,
    dialog: MatDialog,
    layoutService: LayoutService,
    location: Location,
    protected idGeneratorService: IdGeneratorService,
  ) {
    super(store, fullscreenDialog, snackBar, dialog, layoutService, location);
  }

  public onDistributionToggleChange(change: MatSlideToggleChange): void {
    this.customDistribution = change.checked;
  }

  protected mapDistributionFragmentsToPurchaseDebits(): void {
    this.purchase.debits = [];
    this.distributionFragments.forEach((distributionFragment, index) => {
      if (distributionFragment.amount) {
        this.purchase.debits.push(
          new Debit({
            debitId: this.idGeneratorService.generateDebitId(this.purchase.purchaseId, index),  // TODO: Check if debitId is truthy
            debtorId: distributionFragment.user.userId,
            amount: distributionFragment.amount
          })
        );
      }
    });
  }
}
