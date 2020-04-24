import { Component, OnDestroy, OnInit } from '@angular/core';
import { Purchase } from '../core/entity/purchase';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Observable, Subject } from 'rxjs';
import { User } from '../core/entity/user';
import { UserSelectors } from '../store/selectors/user.selectors';
import { PurchaseSelectors } from '../store/selectors/purchase.selectors';
import { takeUntil } from 'rxjs/operators';
import { PurchaseActions } from '../store/actions/purchase.actions';
import { Debit } from '../core/entity/debit';
import { Router } from '@angular/router';


@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.scss']
})
export class PurchaseViewComponent implements OnInit, OnDestroy {

  // FIXME: Load entity data if not present.
  purchase: Purchase;
  user$: Observable<User>;
  debitSum: number;
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.store.select(PurchaseSelectors.selectCurrentPurchase)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((purchase) => {
        if (purchase) {
          this.purchase = purchase;
          this.user$ = this.selectUserById(purchase.buyerId);
          this.debitSum = purchase.debits
            .map((debit: Debit) => debit.amount)
            .reduce((sum, current) => sum + current);
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  selectUserById(id: string): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

  onImageButtonClick(): void {
    this.router.navigate(['receipt', this.purchase.purchaseId]);
  }

  onDeleteButtonClick(): void {
    this.store.dispatch(PurchaseActions.deletePurchase({purchase: this.purchase}));
  }

}
