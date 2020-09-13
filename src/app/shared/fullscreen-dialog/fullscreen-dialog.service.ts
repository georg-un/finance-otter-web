import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ReceiptViewComponent } from '../../pages/receipt-view/receipt-view.component';
import { take, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import { QrScannerComponent } from '../../pages/qr-scanner/qr-scanner.component';
import { AbstractFullscreenDialog } from './abstract-fullscreen-dialog';

@Injectable({
  providedIn: 'root'
})
export class FullscreenDialogService {

  private readonly fullscreenDialogConfig: MatDialogConfig = <MatDialogConfig>{
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh',
    hasBackdrop: false,
    panelClass: 'fullscreen-dialog'  // see app.component.scss
  };

  constructor(private dialog: MatDialog) {
  }

  openReceiptViewDialog(receipt: Observable<Blob>, editButtonsEnabled: boolean, purchaseId?: string): void {
    const dialogRef = this.dialog.open(ReceiptViewComponent, this.fullscreenDialogConfig);
    dialogRef.componentInstance.receipt = receipt;
    dialogRef.componentInstance.purchaseId = purchaseId;
    dialogRef.componentInstance.enableEditButtons = editButtonsEnabled;
    this.handleClose(dialogRef);
  }

  openQrScannerDialog(): Observable<{ date: Date, amount: BigNumber }> {
    const dialogRef = this.dialog.open(QrScannerComponent, this.fullscreenDialogConfig);
    this.handleClose(dialogRef);
    return dialogRef.componentInstance.scanSuccess.pipe(
      // close dialog when there is a result
      tap((result) => result ? dialogRef.close() : undefined),
      takeUntil(dialogRef.afterClosed())
    );
  }

  private handleClose(dialogRef: MatDialogRef<AbstractFullscreenDialog>): void {
    dialogRef.componentInstance.close
      .pipe(take(1))
      .subscribe(() => dialogRef.close());
  }

}
