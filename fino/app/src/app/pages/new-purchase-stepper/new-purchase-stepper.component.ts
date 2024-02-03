import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { PurchaseEditorNewComponent } from '../payment-editor/purchase-editor-new.component';
import { ReceiptEditorComponent } from '../../components/receipt-editor/receipt-editor.component';
import { ReceiptService } from '../../services/receipt.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../components/destroyable';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { addQueryParam } from '../../utils/router-utils';
import { map } from 'rxjs';
import { ReceiptBehaviorService } from '../../behaviors/receipt-behavior/receipt-behavior.service';

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

  formValid = false;

  @ViewChild(PurchaseEditorNewComponent) purchaseEditor?: PurchaseEditorNewComponent;
  @ViewChild(ReceiptEditorComponent) receiptEditor?: ReceiptEditorComponent;
  @ViewChild(MatStepper) stepper?: MatStepper;

  readonly receiptBehavior = inject(ReceiptBehaviorService);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetection: ChangeDetectorRef,
    private receiptService: ReceiptService,
  ) {
    super();
  }

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
    if (this.stepper!.selectedIndex === 0 && !this.receiptBehavior.receiptName) {
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
    if (this.receiptBehavior.receiptName) {
      this.receiptService.deleteReceipt(this.receiptBehavior.receiptName).subscribe();
    }
    void this.router.navigate(['/purchases'], { replaceUrl: true });
  }

  submitPurchase(): void {
    this.purchaseEditor?.handleSubmit();
  }

  onPurchaseCreated(purchaseId: string) {
    void this.router.navigate(['/purchases', purchaseId]);
  }

  onSelectedStepChange($event: StepperSelectionEvent) {
    if ($event.selectedIndex !== $event.previouslySelectedIndex) {
      addQueryParam(this.router, this.activatedRoute, { [STEP_INDEX_QUERY_PARAM]: $event.selectedIndex });
    }
  }
}
