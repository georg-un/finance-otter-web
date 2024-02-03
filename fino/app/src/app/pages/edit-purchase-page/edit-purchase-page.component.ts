import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ReceiptEditorComponent } from '../receipt-editor/receipt-editor.component';
import { filter, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../components/destroyable';
import { addQueryParam } from '../../utils/router-utils';
import { map, switchMap, take, zip } from 'rxjs';
import { RECEIPT_NAME_PATH_PARAM } from '../../../../../domain/receipt-api-models';
import { MatTabsModule } from '@angular/material/tabs';
import { PurchaseEditorEditComponent } from '../payment-editor/purchase-editor-edit.component';
import { PurchaseService } from '../../services/purchase.service';
import { PurchaseDTO } from '../../../../../domain';
import { WithUid } from '../../utils/with-uid';
import { MatStepperModule } from '@angular/material/stepper';
import { SKIP_CACHE_QUERY_PARAM } from '../payment-view/purchase-view.component';

const TAB_INDEX_QUERY_PARAM = 'stepIndex';

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
  ]
})
export class EditPurchasePageComponent extends Destroyable implements OnInit, AfterViewInit {

  tabIndex = 1;
  areChangesPending = false;
  isFormValid = false;
  receiptName?: string;
  purchase?: WithUid<PurchaseDTO>;

  @ViewChild(PurchaseEditorEditComponent) purchaseEditor?: PurchaseEditorEditComponent;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private changeDetection: ChangeDetectorRef,
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
          this.ngZone.run(() => this.router.navigate(['/purchases']));
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
        this.router.navigate(['/purchases']);
        return;
      }
      this.purchase = purchase;
      const receiptName = this.purchase.receiptName;
      if (receiptName) {
        addQueryParam(this.router, this.activatedRoute, { [RECEIPT_NAME_PATH_PARAM]: receiptName });
      }
      setTimeout(() => this.syncFormValidity());
    });
  }

  ngAfterViewInit() {
    // Sync stepIndex param to MatStepper
    this.activatedRoute.queryParamMap.pipe(
      map((paramMap) => paramMap.get(TAB_INDEX_QUERY_PARAM)),
      map((tabIndex) => parseInt(tabIndex!)),  // worst case it's NaN
      filter((tabIndex) => !isNaN(tabIndex)),
      takeUntil(this.onDestroy$),
    ).subscribe((tabIndex) => {
      this.tabIndex = tabIndex;
      this.changeDetection.detectChanges();
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
  }

  private syncFormValidity(): void {
    // Keep track of form validity
    const form = this.purchaseEditor!.form;
    form.statusChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      console.log({ touched: form.touched, valid: form.valid });
      this.isFormValid = form.valid;
    });
  }

  cancel(): void {
    this.location.back();
  }

  submitPurchase(): void {
    this.purchaseEditor!.handleSubmit();
  }

  onPurchaseUpdated(purchaseId: string) {
    void this.router.navigate(['/purchases', purchaseId], { queryParams: { [SKIP_CACHE_QUERY_PARAM]: true } });
  }

  onTabIndexChange(newTabIndex: number) {
    this.tabIndex = newTabIndex;
    addQueryParam(this.router, this.activatedRoute, { [TAB_INDEX_QUERY_PARAM]: newTabIndex });
  }

  onReceiptNameChange(receiptName: string | undefined) {
    if (receiptName !== this.receiptName) {
      this.areChangesPending = true;
      addQueryParam(this.router, this.activatedRoute, {
        [RECEIPT_NAME_PATH_PARAM]: receiptName ? receiptName : null  // null removes the query param
      });
    }
  }
}

