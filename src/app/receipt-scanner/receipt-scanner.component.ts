import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocScannerConfig, NgxDocScannerComponent } from 'ngx-document-scanner';
import { MatSnackBar } from '@angular/material';
import { PurchaseEditorService } from '../purchase-editor/purchase-editor.service';

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
    private snackBar: MatSnackBar,
    private purchaseEditorService: PurchaseEditorService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Overwrite private ngx-doc-scanner properties
    this.docScanner['selectedFilter'] = 'original';  // set default image-filter
    this.docScanner['editorButtons'].find(button => button.name === 'exit').icon = 'clear';  // set exit icon

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
    this.purchaseEditorService.receipt = $event;
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

}
