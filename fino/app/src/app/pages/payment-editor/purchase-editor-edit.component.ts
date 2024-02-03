import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { PurchaseService } from '../../services/purchase.service';
import { DebitSumPipe } from '../../utils/debit-sum.pipe';
import { AbstractPurchaseEditorComponent, PURCHASE_EDITOR_IMPORTS, PURCHASE_EDITOR_PROVIDERS } from './abstract-purchase-editor.component';
import { PurchaseDTO } from '../../../../../domain';
import { WithUid } from '../../utils/with-uid';
import { merge } from 'rxjs';

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

  @Input() purchase!: WithUid<PurchaseDTO>;

  @Output() purchaseUpdated = new EventEmitter<string>();

  constructor(
    router: Router,
    authService: AuthService,
    userService: UserService,
    categoryService: CategoryService,
    purchaseService: PurchaseService,
    private debitSumPipe: DebitSumPipe,
  ) {
    super(router, authService, userService, categoryService, purchaseService);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.debitFormGroupInitialized.pipe(
      filter(Boolean),
      takeUntil(this.onDestroy$),
    ).subscribe(() => {
      this.mapPurchaseToForm(this.purchase);
    });

    merge(
      this.form.get(this.FORM_PROPS.AMOUNT)!.valueChanges,
      this.debits.valueChanges.pipe(distinctUntilChanged(this.compareByJson))
    ).pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.validateAllDebits();
      });
  }

  override handleSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    this.validateAllDebits();
    if (this.form.invalid) {
      return;
    }
    this.distributeDebitsIfDistributionModeEqual();
    const purchaseId = this.purchase.uid;
    if (!purchaseId) {
      alert('Purchase ID is missing. Please try again later.');
      return;
    }
    const purchaseUpdate = this.getPurchaseFromFormGroup(this.form);
    this.purchaseService.updatePurchase(purchaseId, purchaseUpdate).pipe(
      takeUntil(this.onDestroy$),
    ).subscribe(() => {
      this.purchaseUpdated.next(purchaseId);
    });
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
      this.debits.controls.find((debitControl) => {
        return debitControl.get(this.DEBIT_FORM_PROPS.USER)?.value?.uid === userUid;
      })?.get(this.DEBIT_FORM_PROPS.AMOUNT)?.setValue(amount);
    });
  }

  private compareByJson(prev: any, curr: any): boolean {
    return JSON.stringify(prev) === JSON.stringify(curr);
  }
}
