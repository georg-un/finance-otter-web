import { Component, EventEmitter, Output } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BigNumber } from 'bignumber.js';
import { AbstractFullscreenDialog } from '../../shared/fullscreen-dialog/abstract-fullscreen-dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent extends AbstractFullscreenDialog {

  readonly allowedFormats = [BarcodeFormat.QR_CODE];
  complete = false;
  scannerStarted = false;
  noDevices = false;
  noPermission = false;

  @Output() scanSuccess: EventEmitter<{ date: Date, amount: BigNumber }> = new EventEmitter();

  private snackBarRef: MatSnackBarRef<any>;

  constructor(private snackBar: MatSnackBar
  ) {
    super();
  }

  onScannerHasDevices($event) {
    this.noDevices = !$event;
  }

  onScannerPermissionResponse($event) {
    this.noPermission = !$event;
  }

  onScannerAutostarted() {
    this.scannerStarted = true;
  }

  onScanSuccess($event: string) {
    const result = this.extractAmountFromQrContent($event);
    if (result) {
      this.complete = true;
      setTimeout(() => {
        this.scanSuccess.emit(result);
      }, 1500); // wait for the checkmark-animation to finish
    }
  }

  private extractAmountFromQrContent(qrContent: string): { date: Date, amount: BigNumber } {
    const parts = qrContent.split('_');
    // Check if QR code is compliant with the Registrierkassensicherheitsverordnung
    // https://de.wikipedia.org/wiki/Registrierkassensicherheitsverordnung
    if (parts.length !== 14 || !parts[1].startsWith('R1')) {
      // Show a snackbar if there is not already one displayed
      if (!this.snackBarRef || this.snackBarRef.containerInstance._animationState === 'hidden') {
        console.error('Incompatible QR-code content.');
        this.snackBarRef = this.snackBar.open('This QR-code is not in the right format.');
      }
      return undefined;
    }
    return {
      date: new Date(parts[4]),
      amount: parts
        .slice(5, 10) // Extract all amounts
        .map(part => part.replace(/,/g, '.'))  // replace commas with points in case the numbers have a German format
        .map(part => new BigNumber(part))
        .reduce((acc: BigNumber, curr: BigNumber) => acc.plus(curr), new BigNumber(0)) // calculate the sum of all amounts
    };
  }

}
