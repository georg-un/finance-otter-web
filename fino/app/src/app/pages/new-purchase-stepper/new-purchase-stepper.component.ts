import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { PurchaseEditorNewComponent } from '../payment-editor/purchase-editor-new.component';
import { ReceiptEditorComponent } from '../receipt-editor/receipt-editor.component';
import { ReceiptService } from '../../services/receipt.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../components/destroyable';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { addQueryParam } from '../../utils/router-utils';
import { map } from 'rxjs';
import { RECEIPT_NAME_PATH_PARAM } from '../../../../../domain/receipt-api-models';

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
  ]
})
export class NewPurchaseStepperComponent extends Destroyable implements AfterViewInit {

  formValid = false;
  receiptName?: string;

  @ViewChild(PurchaseEditorNewComponent) purchaseEditor?: PurchaseEditorNewComponent;
  @ViewChild(MatStepper) stepper?: MatStepper;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetection: ChangeDetectorRef,
    private receiptService: ReceiptService,
  ) {
    super();
  }

  ngAfterViewInit() {
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

    // Sync receipt name to ReceiptEditor
    this.activatedRoute.queryParamMap.pipe(
      map((paramMap) => paramMap.get(RECEIPT_NAME_PATH_PARAM)),
      filter(Boolean),
      takeUntil(this.onDestroy$),
    ).subscribe((receiptName) => {
      this.receiptName = receiptName;
      this.changeDetection.detectChanges();
    });

    // Keep track of form validity
    const form = this.purchaseEditor!.form;
    form.statusChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.formValid = form.touched && form.valid;
    });
  }

  cancel(): void {
    if (this.receiptName) {
      this.receiptService.deleteReceipt(this.receiptName).subscribe();
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

  onReceiptNameChange(receiptName: string | undefined) {
    if (receiptName !== this.receiptName) {
      addQueryParam(this.router, this.activatedRoute, {
        [RECEIPT_NAME_PATH_PARAM]: receiptName ? receiptName : null  // null removes the query param
      });
    }
  }
}

// TODO: the idea is now the following: refactor the editor components to dumb components and wrap them in a stepper for new & normal smart component for edit.


// TODO: In detail view, you can use tabs for receipt & details. Then you have the same mental UI model as in the stepper.
