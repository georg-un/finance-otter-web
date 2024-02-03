import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ReceiptEditorComponent } from '../receipt-editor/receipt-editor.component';
import { takeUntil } from 'rxjs/operators';
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
import { TabBehaviorService } from '../../behaviors/tab-behavior/tab-behavior.service';
import { ReceiptBehaviorService } from '../../behaviors/receipt-behavior/receipt-behavior.service';

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
    {
      provide: TabBehaviorService,
      useFactory: () => new TabBehaviorService(1),
    },
    ReceiptBehaviorService
  ]
})
export class EditPurchasePageComponent extends Destroyable implements OnInit {

  areChangesPending = false;
  isFormValid = false;
  purchase?: WithUid<PurchaseDTO>;

  @ViewChild(PurchaseEditorEditComponent) purchaseEditor?: PurchaseEditorEditComponent;

  readonly tabBehavior = inject(TabBehaviorService);
  readonly receiptBehavior = inject(ReceiptBehaviorService);

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

  onReceiptNameChange(receiptName: string | undefined) {
    this.areChangesPending = true;
    this.receiptBehavior.receiptNameChange(receiptName);
  }
}

