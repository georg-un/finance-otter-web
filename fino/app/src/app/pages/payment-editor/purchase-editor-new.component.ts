import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { PurchaseService } from '../../services/purchase.service';
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
export class PurchaseEditorNewComponent extends AbstractPurchaseEditorComponent implements OnInit {

  @Input() receiptName?: string;

  @Output() purchaseCreated = new EventEmitter<string>();

  constructor(
    router: Router,
    authService: AuthService,
    userService: UserService,
    categoryService: CategoryService,
    purchaseService: PurchaseService,
  ) {
    super(router, authService, userService, categoryService, purchaseService);
  }

  override handleSubmit(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    this.distributeDebitsIfDistributionModeEqual();
    const purchase = this.getPurchaseFromFormGroup(this.form);
    purchase.receiptName = this.receiptName;
    this.purchaseService.createPurchase(purchase).pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((purchaseId) => {
      this.purchaseCreated.next(purchaseId);
    });
  }
}
