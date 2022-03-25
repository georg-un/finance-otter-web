import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReceiptProcessorService } from '../../pages/receipt-processor/receipt-processor.service';
import { Router } from '@angular/router';
import { AddReceiptDialog, AddReceiptDialogData } from './add-receipt-dialog.component';


@Component({
  selector: 'app-add-purchase-dialog',
  templateUrl: './add-purchase-dialog.component.html',
  styleUrls: ['./add-purchase-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPurchaseDialogComponent extends AddReceiptDialog {

  constructor(
    dialogRef: MatDialogRef<AddPurchaseDialogComponent>,
    router: Router,
    snackBar: MatSnackBar,
    receiptProcessorService: ReceiptProcessorService,
    @Inject(MAT_DIALOG_DATA) data: AddReceiptDialogData
  ) {
    super(dialogRef, router, snackBar, receiptProcessorService, data);
  }

  public addPurchaseWithoutReceipt(): void {
    this.receiptProcessorService.receipt = undefined;
    this.router.navigate(['new-purchase']).then(() => this.dialogRef.close(true));
  }

  public addCompensation(): void {
    this.receiptProcessorService.receipt = undefined;
    this.router.navigate(['new-compensation']).then(() => this.dialogRef.close(true));
  }
}
