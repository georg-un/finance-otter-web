import { Component, NgZone, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Purchase } from '../../model/purchase';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { map, switchMap, take, tap, zip } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { PurchaseService } from '../../services/purchase.service';
import { DebitSumPipe } from '../../utils/debit-sum.pipe';
import { SKIP_CACHE_QUERY_PARAM } from '../payment-view/purchase-view.component';
import {
  AbstractPurchaseEditorComponent,
  PURCHASE_EDITOR_IMPORTS,
  PURCHASE_EDITOR_PROVIDERS
} from './abstract-purchase-editor.component';

@Component({
  selector: 'app-purchase-editor',
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

  private purchaseId?: string;

  constructor(
    router: Router,
    authService: AuthService,
    userService: UserService,
    categoryService: CategoryService,
    purchaseService: PurchaseService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private debitSumPipe: DebitSumPipe,
  ) {
    super(router, authService, userService, categoryService, purchaseService);
  }

  override ngOnInit() {
    super.ngOnInit();
    zip([
      this.route.paramMap,
      this.debitFormGroupInitialized.pipe(filter(Boolean)),
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
      tap((purchaseId) => this.purchaseId = purchaseId),
      switchMap((purchaseId) => this.purchaseService.getPurchase(purchaseId)),
      take(1),
      takeUntil(this.onDestroy$)
    ).subscribe((purchase) => {
      if (!purchase) {
        alert('Purchase not found.');
        this.router.navigate(['/purchases']);
        return;
      }
      this.mapPurchaseToForm(purchase);
    });
  }

  override handleSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    this.distributeDebitsIfDistributionModeEqual();
    const purchaseUpdate = this.getPurchaseFromFormGroup(this.form);
    if (!purchaseUpdate || !this.purchaseId) {
      alert('Something went wrong. Please try again later.');
      return;
    }
    this.purchaseService.updatePurchase(this.purchaseId, purchaseUpdate).pipe(
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe(() => {
      this.router.navigate(
        ['/purchases', this.purchaseId],
        { queryParams: { [SKIP_CACHE_QUERY_PARAM]: true } }
      );
    });
  }

  override cancel() {
    this.router.navigate(['/purchases', `${this.purchaseId ?? ''}`], { replaceUrl: true });
  }

  private mapPurchaseToForm(purchase: Purchase) {
    this.form.get(this.FORM_PROPS.SHOP)?.setValue(purchase.shop);
    this.form.get(this.FORM_PROPS.CATEGORY)?.setValue(purchase.category);
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
}
