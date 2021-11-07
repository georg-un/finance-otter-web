import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReceiptProcessorService } from '../../pages/receipt-processor/receipt-processor.service';
import { Router } from '@angular/router';
import { ReceiptProcessorUrlParams } from '../../pages/receipt-processor/receipt-processor.component';

export interface AddReceiptDialogData {
  purchaseId?: string;
}


@Component({
  selector: 'app-add-receipt-dialog',
  templateUrl: './add-receipt-dialog.component.html',
  styleUrls: ['add-purchase-dialog.component.scss']
})
export class AddReceiptDialog {

  constructor(
    protected dialogRef: MatDialogRef<AddReceiptDialog>,
    protected router: Router,
    protected snackBar: MatSnackBar,
    protected receiptProcessorService: ReceiptProcessorService,
    @Inject(MAT_DIALOG_DATA) public data: AddReceiptDialogData
  ) {
  }

  public onImageCapture(files): void {
    if (files.length > 1) {
      this.snackBar.open('Multiple files selected. Only the first one will be used.');
    }
    this.receiptProcessorService.receipt = files[0];
    const isUpdateMode = !!this.data?.purchaseId;
    const queryParams = isUpdateMode ? {[ReceiptProcessorUrlParams.PURCHASE_ID]: this.data?.purchaseId} : undefined;
    this.router.navigate(['scan-receipt'], {queryParams: queryParams, replaceUrl: isUpdateMode})
      .then(() => this.dialogRef.close(true));
  }
}
