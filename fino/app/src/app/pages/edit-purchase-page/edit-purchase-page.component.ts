import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ReceiptEditorComponent } from '../../components/receipt-editor/receipt-editor.component';
import { takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../components/destroyable';
import { map, Observable, of, switchMap, take, zip } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { PurchaseEditorEditComponent } from '../../components/purchase-editor/purchase-editor-edit.component';
import { PurchaseService } from '../../services/purchase.service';
import { PurchaseDTO } from '../../../../../domain';
import { WithUid } from '../../utils/with-uid';
import { MatStepperModule } from '@angular/material/stepper';
import { SKIP_CACHE_QUERY_PARAM } from '../payment-view/purchase-view.component';
import { TabBehaviorService } from '../../behaviors/tab-behavior/tab-behavior.service';
import { ReceiptBehaviorService } from '../../behaviors/receipt-behavior/receipt-behavior.service';
import { convertImageToDataUrl } from '../../utils/convert-image';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-edit-purchase-page',
  templateUrl: './edit-purchase-page.component.html',
  styleUrls: ['edit-purchase-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatTabsModule,
    PurchaseEditorEditComponent,
    ReceiptEditorComponent,
    MatStepperModule,
  ],
  providers: [
    TabBehaviorService,
    ReceiptBehaviorService
  ]
})
export class EditPurchasePageComponent extends Destroyable implements OnInit {
  readonly tabBehavior = inject(TabBehaviorService);
  readonly receiptBehavior = inject(ReceiptBehaviorService);
  private readonly receiptService = inject(ReceiptService);

  isFormValid = false;
  purchase?: WithUid<PurchaseDTO>;

  @ViewChild(PurchaseEditorEditComponent) purchaseEditor?: PurchaseEditorEditComponent;

  private originalReceiptSrc?: string;
  private newReceipt?: File;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private purchaseService: PurchaseService,
  ) {
    super();
  }

  ngOnInit() {
    zip([
      this.activatedRoute.paramMap,
    ]).pipe(
      map((args) => args[0].get('id')),
      map((purchaseId) => {
        if (!purchaseId) {
          const errorMessage = 'No purchase-id in URL.';
          alert(errorMessage);
          void this.ngZone.run(() => this.router.navigate(['/purchases']));
          throw new Error(errorMessage);
        }
        return purchaseId!;
      }),
      switchMap((purchaseId) => this.purchaseService.getPurchase(purchaseId)),
      take(1),
      takeUntil(this.onDestroy$)
    ).subscribe((purchase) => {
      if (!purchase) {
        alert('Purchase not found.');
        void this.router.navigate(['/purchases']);
        return;
      }
      this.purchase = purchase;
      const receiptName = this.purchase.receiptName;
      this.originalReceiptSrc = receiptName;
      this.receiptBehavior.receiptSrcChange(receiptName);
      setTimeout(() => this.syncFormValidity());
    });
  }

  private syncFormValidity(): void {
    // Keep track of form validity
    const form = this.purchaseEditor!.form;
    form.statusChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.isFormValid = form.valid;
    });
  }

  cancel(): void {
    this.location.back();
  }

  submitPurchaseUpdate() {
    this.purchaseEditor!.validatePurchase();
  }

  private submitReceiptUpdate(purchaseId: string): Observable<string | undefined> {
    // no changes
    if (this.receiptBehavior.receiptSrc === this.originalReceiptSrc) {
      return of();
    }
    // no receipt before but now there's a new receipt  -->  upload new
    if (!this.originalReceiptSrc && this.receiptBehavior.receiptSrc && this.newReceipt) {
      return this.receiptService.uploadReceipt(this.newReceipt);
    }
    // receipt before but now there is no receipt  -->  delete original
    if (this.originalReceiptSrc && !this.receiptBehavior.receiptSrc) {
      return this.receiptService.deleteReceiptForExistingPurchase(this.originalReceiptSrc, purchaseId).pipe(map(() => undefined));
    }
    // receipt before and now there is a new one  -->  replace original
    if (this.originalReceiptSrc && this.receiptBehavior.receiptSrc && this.newReceipt) {
      return this.receiptService.replaceReceipt(this.originalReceiptSrc, this.newReceipt).pipe(map(() => undefined));
    }
    // none of the above  -->  unexpected state
    console.error({
      originalReceiptSrc: this.originalReceiptSrc,
      urlReceiptSrc: this.receiptBehavior.receiptSrc,
      newReceipt: this.newReceipt
    });
    throw new Error('Unexpected state when trying to submit the receipt.');
  }

  onUpdatePurchase(purchaseUpdate: WithUid<PurchaseDTO>) {
    const purchaseId = purchaseUpdate.uid;
    return this.submitReceiptUpdate(purchaseId).pipe(
      switchMap((receiptSrc) => {
        purchaseUpdate.receiptName = receiptSrc;
        return this.purchaseService.updatePurchase(purchaseId, purchaseUpdate);
      })
    ).subscribe(() => {
      void this.router.navigate(['/purchases', purchaseId], { queryParams: { [SKIP_CACHE_QUERY_PARAM]: true } });
    });
  }

  onDeletePurchase() {
    const purchaseId = this.purchase?.uid;
    if (!purchaseId) {
      return;
    }
    this.purchaseService.deletePurchase(purchaseId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => void this.router.navigate(['/purchases']));
  }

  onNewReceipt(receipt: File) {
    convertImageToDataUrl(receipt).subscribe((dataUrl) => {
      if (typeof dataUrl === 'string') {
        this.receiptBehavior.receiptSrcChange(dataUrl);
        this.newReceipt = receipt;
      } else {
        console.error('Received unexpected dataUrl:', dataUrl);
      }
    });
  }

  onDeleteReceipt() {
    this.receiptBehavior.receiptSrcChange(undefined);
    this.newReceipt = undefined;
  }
}

