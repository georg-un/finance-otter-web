import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { DocScannerConfig, NgxDocScannerComponent } from 'ngx-document-scanner';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { RouterSelectors } from '../store/selectors/router.selectors';
import { take } from 'rxjs/operators';
import { ReceiptScannerService } from './receipt-scanner.service';

@Component({
  selector: 'app-receipt-scanner',
  templateUrl: './receipt-scanner.component.html',
  styleUrls: ['./receipt-scanner.component.scss']
})
export class ReceiptScannerComponent implements OnInit, AfterViewInit {

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @ViewChild('docScanner', {static: false}) docScanner: NgxDocScannerComponent;

  private rawImage;

  config: DocScannerConfig = {
    editorBackgroundColor: '#e3f2fd',
    buttonThemeColor: 'primary',
    cropToolColor: '#f44336',
    cropToolShape: 'circle',
    exportImageIcon: 'done'
  };

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private receiptScannerService: ReceiptScannerService
  ) {
  }

  ngOnInit() {
    // Make sure all previously captured images are cleared from the service
    this.receiptScannerService.receipt = undefined;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Overwrite private ngx-doc-scanner properties
      this.docScanner['selectedFilter'] = 'original';  // set default image-filter
      this.docScanner['editorButtons'].find(button => button.name === 'exit').icon = 'clear';  // set exit icon
    }, 0);

    // Prompt user for receipt image
    this.promptImageCapture();
  }

  onImageCapture($event) {
    if ($event && $event.target && $event.target.files) {
      if ($event.target.files.length > 1) {
        this.snackBar.open('Multiple files selected. Only the first one will be used.');
      }
      this.rawImage = $event.target.files[0];
    }
  }

  onEditResult($event) {
    this.receiptScannerService.receipt = $event;
    this.navigateToEditor();
  }

  onExitEditor($event) {
    this.rawImage = null;
  }

  promptImageCapture(): void {
    this.fileInput.nativeElement.click();
  }

  isProcessing(): boolean {
    return this.rawImage && !this.docScanner.imageLoaded;
  }

  navigateToEditor(): void {
    this.store.select(RouterSelectors.selectPurchaseId)
      .pipe(take(1))
      .subscribe((purchaseId: string) => {
        const commands = purchaseId ? ['edit', purchaseId] : ['new'];
        this.ngZone.run(() => {
          this.router.navigate(commands);
        });
      });
  }

}
