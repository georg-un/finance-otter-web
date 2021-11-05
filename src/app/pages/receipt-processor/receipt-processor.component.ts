import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DocScannerConfig, NgxDocScannerComponent } from '@fino-ngx-doc-scanner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { ReceiptProcessorService } from './receipt-processor.service';
import { PurchaseActions } from '../../store/actions/purchase.actions';
import { HeaderConfig } from '../../shared/domain/header-config';
import { LayoutActions } from '../../store/actions/layout.actions';
import { LayoutService } from '../../layout/layout.service';

const HEADER_CONFIG: HeaderConfig = {leftButton: null, rightButton: null, showLogo: true};

export enum ReceiptProcessorUrlParams {
  PURCHASE_ID = 'purchaseId',
}


@Component({
  selector: 'app-receipt-processor',
  templateUrl: './receipt-processor.component.html',
  styleUrls: ['./receipt-processor.component.scss']
})
export class ReceiptProcessorComponent implements OnInit, AfterViewInit {

  @ViewChild('docScanner', {static: false}) docScanner: NgxDocScannerComponent;

  readonly config: DocScannerConfig = {
    editorBackgroundColor: '#e3f2fd',
    buttonThemeColor: 'primary',
    cropToolColor: '#f44336',
    cropToolShape: 'circle',
    exportImageIcon: 'done'
  };

  public docScannerReady: boolean = false;
  public purchaseId: string;

  public rawImage: File;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private receiptProcessorService: ReceiptProcessorService,
    private layoutService: LayoutService
  ) {
    if (!this.receiptProcessorService.receipt) {
      console.error('Receipt processor did not receive a receipt.');
    }
    this.store.dispatch(LayoutActions.setHeaderConfig(HEADER_CONFIG));
    this.layoutService.registerLeftHeaderButtonClickCallback(() => {});
    this.layoutService.registerRightHeaderButtonClickCallback(() => {});
  }

  ngOnInit() {
    this.purchaseId = this.activatedRoute.snapshot.queryParamMap.get(ReceiptProcessorUrlParams.PURCHASE_ID);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Overwrite private ngx-doc-scanner properties
      this.docScanner['selectedFilter'] = 'original';  // set default image-filter
      this.docScanner['editorButtons'].find(button => button.name === 'exit').icon = 'clear';  // set exit icon
      this.rawImage = this.receiptProcessorService.receipt as File;
    }, 0);
  }

  onDocScannerReady($event: boolean) {
    this.docScannerReady = $event;
  }

  onEditResult($event) {
    this.receiptProcessorService.receipt = $event;
    this.dispatchAndLeave();
  }

  onExitEditor() {
    this.rawImage = null;
  }

  isProcessing(): boolean {
    return this.rawImage && !this.docScanner.imageLoaded;
  }

  dispatchAndLeave(): void {
    if (this.purchaseId) {
      // Show snack message & exit method, if editor is in editing mode but there is no receipt
      if (!this.receiptProcessorService.receipt) {
        this.snackBar.open('Did not get a receipt.');
        return;
      }
      // If the purchase already exists, update the receipt and navigate to the purchase-viewer
      this.store.dispatch(PurchaseActions.updateReceipt({
        receipt: this.receiptProcessorService.receipt,
        purchaseId: this.purchaseId
      }));
      this.router.navigate(['purchase', this.purchaseId]);
    } else {
      // If the purchase does not exist yet, navigate to the editor-new
      this.router.navigate(['new']);
    }
  }
}
