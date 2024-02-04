import { Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AbstractPurchaseEditorComponent, PURCHASE_EDITOR_IMPORTS, PURCHASE_EDITOR_PROVIDERS } from './abstract-purchase-editor.component';

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

  @Input() receiptName?: string;

  @Output() purchaseCreated = new EventEmitter<string>();

  override submitPurchase(): void {
    this.purchaseFormBehavior.form.markAllAsTouched();
    this.purchaseFormBehavior.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    this.purchaseFormBehavior.distributeDebitsIfDistributionModeEqual();
    const purchase = this.purchaseFormBehavior.getPurchaseFromFormGroup(this.form);
    purchase.receiptName = this.receiptName;
    this.purchaseService.createPurchase(purchase).pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((purchaseId) => {
      this.purchaseCreated.next(purchaseId);
    });
  }
}
