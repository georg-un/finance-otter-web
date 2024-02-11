import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractPurchaseEditorComponent, PURCHASE_EDITOR_IMPORTS, PURCHASE_EDITOR_PROVIDERS } from './abstract-purchase-editor.component';
import { PURCHASE_FORM_PROPS } from './form/purchase-form-group';
import { PurchaseDTO } from '../../../../../domain';

@Component({
  selector: 'app-purchase-editor-new',
  templateUrl: './purchase-editor.component.html',
  styleUrls: ['./purchase-editor.component.scss'],
  standalone: true,
  imports: [
    ...PURCHASE_EDITOR_IMPORTS,
  ],
  providers: [
    ...PURCHASE_EDITOR_PROVIDERS
  ],
})
export class PurchaseEditorNewComponent extends AbstractPurchaseEditorComponent {
  override readonly EDIT_MODE: 'EDIT' | 'CREATE' = 'CREATE';

  @Input() set receiptName(val: string | undefined) {
    this.form.get(PURCHASE_FORM_PROPS._RECEIPT_NAME)!.setValue(val);
  }

  @Output() readonly createPurchase = new EventEmitter<PurchaseDTO>();

  override validatePurchase(): void {
    this.purchaseFormBehavior.validateAllDebits();
    this.purchaseFormBehavior.form.markAllAsTouched();
    this.purchaseFormBehavior.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    this.purchaseFormBehavior.distributeDebitsIfDistributionModeEqual();
    const purchase = this.purchaseFormBehavior.getPurchaseFromFormGroup(this.form);

    this.createPurchase.emit(purchase);
  }

  override onDeletePurchase() {
    throw new Error('Deleting purchase is not implemented for new-purchase flow.');
  }
}
