import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { DebitSumPipe } from '../../utils/debit-sum.pipe';
import { AbstractPurchaseEditorComponent, PURCHASE_EDITOR_IMPORTS, PURCHASE_EDITOR_PROVIDERS } from './abstract-purchase-editor.component';
import { PurchaseDTO } from '../../../../../domain';
import { WithUid } from '../../utils/with-uid';
import { merge } from 'rxjs';
import { PURCHASE_FORM_PROPS } from './form/purchase-form-group';

@Component({
  selector: 'app-purchase-editor-edit',
  templateUrl: './purchase-editor.component.html',
  styleUrls: ['./purchase-editor.component.scss'],
  standalone: true,
  imports: [
    ...PURCHASE_EDITOR_IMPORTS,
  ],
  providers: [
    ...PURCHASE_EDITOR_PROVIDERS
  ]
})
export class PurchaseEditorEditComponent extends AbstractPurchaseEditorComponent implements OnInit {
  override readonly EDIT_MODE: 'EDIT' | 'CREATE' = 'EDIT';

  private debitSumPipe = inject(DebitSumPipe);

  @Input() purchase!: WithUid<PurchaseDTO>;

  @Input() set receiptName(val: string | undefined) {
    // We set the receipt name as form property in order to track changes as part of form validation
    // We do not use this form prop for the final receipt name though
    this.form.get(PURCHASE_FORM_PROPS._RECEIPT_NAME)!.setValue(val);
  }

  @Output() readonly updatePurchase = new EventEmitter<WithUid<PurchaseDTO>>();

  @Output() deletePurchase = new EventEmitter<void>();

  ngOnInit() {
    this.purchaseFormBehavior.debitFormGroupInitialized$.pipe(
      filter(Boolean),
      takeUntil(this.onDestroy$),
    ).subscribe(() => {
      this.mapPurchaseToForm(this.purchase);
    });

    merge(
      this.form.get(this.FORM_PROPS.AMOUNT)!.valueChanges,
      this.purchaseFormBehavior.debits.valueChanges.pipe(distinctUntilChanged(this.compareByJson))
    ).pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.purchaseFormBehavior.validateAllDebits();
      });
  }

  override validatePurchase() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    this.purchaseFormBehavior.validateAllDebits();
    if (this.form.invalid) {
      return;
    }
    this.purchaseFormBehavior.distributeDebitsIfDistributionModeEqual();
    const purchaseId = this.purchase.uid;
    if (!purchaseId) {
      alert('Purchase ID is missing. Please try again later.');
      return;
    }
    const purchaseUpdate: WithUid<PurchaseDTO> = {
      ...this.purchaseFormBehavior.getPurchaseFromFormGroup(this.form),
      uid: purchaseId,
    };

    this.updatePurchase.emit(purchaseUpdate);
  }

  override onDeletePurchase() {
    const purchaseId = this.purchase.uid;
    if (!purchaseId) {
      alert('Purchase ID is missing. Please try again later.');
      return;
    }
    this.deletePurchase.next();
  }

  private mapPurchaseToForm(purchase: WithUid<PurchaseDTO>) {
    this.form.get(this.FORM_PROPS.SHOP)?.setValue(purchase.shop);
    this.form.get(this.FORM_PROPS.CATEGORY)?.setValue(purchase.categoryUid);
    this.form.get(this.FORM_PROPS.AMOUNT)?.setValue(this.debitSumPipe.transform(purchase.debits));
    this.form.get(this.FORM_PROPS.DESCRIPTION)?.setValue(purchase.description ?? '');
    this.form.get(this.FORM_PROPS.DATE)?.setValue(moment(purchase.date));
    this.form.get(this.FORM_PROPS.DISTRIBUTION_MODE)?.setValue(this.DISTRIBUTION_MODES.CUSTOM);
    Object.entries(purchase.debits).forEach((debit) => {
      const userUid = debit[0];
      const amount = debit[1];
      this.purchaseFormBehavior.debits.controls.find((debitControl) => {
        return debitControl.get(this.DEBIT_FORM_PROPS.USER)?.value?.uid === userUid;
      })?.get(this.DEBIT_FORM_PROPS.AMOUNT)?.setValue(amount);
    });
  }

  private compareByJson(prev: any, curr: any): boolean {
    return JSON.stringify(prev) === JSON.stringify(curr);
  }
}
