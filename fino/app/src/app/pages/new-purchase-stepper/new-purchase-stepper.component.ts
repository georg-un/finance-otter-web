import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { PurchaseEditorNewComponent } from '../../components/purchase-editor/purchase-editor-new.component';
import { ReceiptEditorComponent } from '../../components/receipt-editor/receipt-editor.component';
import { ReceiptService } from '../../services/receipt.service';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../components/destroyable';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { addQueryParam } from '../../utils/router-utils';
import { map, of } from 'rxjs';
import { ReceiptBehaviorService } from '../../behaviors/receipt-behavior/receipt-behavior.service';
import { convertImageToDataUrl } from '../../utils/convert-image';
import { PurchaseDTO } from '../../../../../domain';
import { PurchaseService } from '../../services/purchase.service';

const STEP_INDEX_QUERY_PARAM = 'stepIndex';

@Component({
  selector: 'app-new-purchase-stepper',
  templateUrl: './new-purchase-stepper.component.html',
  styleUrls: ['new-purchase-stepper.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatStepperModule,
    PurchaseEditorNewComponent,
    ReceiptEditorComponent,
  ],
  providers: [
    ReceiptBehaviorService
  ]
})
export class NewPurchaseStepperComponent extends Destroyable implements AfterViewInit {
  readonly receiptBehavior = inject(ReceiptBehaviorService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly receiptService = inject(ReceiptService);
  private readonly changeDetection = inject(ChangeDetectorRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild(PurchaseEditorNewComponent) purchaseEditor?: PurchaseEditorNewComponent;
  @ViewChild(ReceiptEditorComponent) receiptEditor?: ReceiptEditorComponent;
  @ViewChild(MatStepper) stepper?: MatStepper;

  formValid = false;
  private receipt?: File;

  ngAfterViewInit() {
    this.syncFormValidity();

    // Sync stepIndex param to MatStepper
    this.activatedRoute.queryParamMap.pipe(
      map((paramMap) => paramMap.get(STEP_INDEX_QUERY_PARAM)),
      map((stepIndex) => parseInt(stepIndex!)),  // worst case it's NaN
      filter((stepIndex) => !isNaN(stepIndex)),
      takeUntil(this.onDestroy$),
    ).subscribe((stepIndex) => {
      if (this.stepper && this.stepper.selectedIndex !== stepIndex) {
        this.stepper.selectedIndex = stepIndex;
        this.changeDetection.detectChanges();
      }
    });

    // Open camera if applicable
    if (this.stepper!.selectedIndex === 0 && !this.receiptBehavior.receiptSrc) {
      this.receiptEditor!.triggerCameraInput();
    }
  }

  private syncFormValidity(): void {
    // Keep track of form validity
    const form = this.purchaseEditor!.form;
    form.statusChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.formValid = form.touched && form.valid;
    });
  }

  cancel(): void {
    void this.router.navigate(['/purchases'], { replaceUrl: true });
  }

  submitPurchase(): void {
    this.purchaseEditor?.validatePurchase();
  }

  onCreatePurchase(purchase: PurchaseDTO): void {
    const receiptName$ = this.receiptBehavior.receiptSrc && this.receipt
      ? this.receiptService.uploadReceipt(this.receipt)
      : of();

    receiptName$.pipe(
      map((receiptSrc) => ({ ...purchase, receiptName: receiptSrc })),
      switchMap((purchaseWithReceipt) => this.purchaseService.createPurchase(purchaseWithReceipt)),
      takeUntil(this.onDestroy$),
    ).subscribe((purchaseId) => {
      void this.router.navigate(['/purchases', purchaseId]);
    });
  }

  onSelectedStepChange($event: StepperSelectionEvent) {
    if ($event.selectedIndex !== $event.previouslySelectedIndex) {
      addQueryParam(this.router, this.activatedRoute, { [STEP_INDEX_QUERY_PARAM]: $event.selectedIndex });
    }
  }

  onNewReceipt(receipt: File) {
    convertImageToDataUrl(receipt).subscribe((dataUrl) => {
      if (typeof dataUrl === 'string') {
        this.receiptBehavior.receiptSrcChange(dataUrl);
        this.receipt = receipt;
      } else {
        console.error('Received unexpected dataUrl:', dataUrl);
      }
    });
  }

  onDeleteReceipt() {
    this.receiptBehavior.receiptSrcChange(undefined);
  }
}
