import { Component, OnInit } from '@angular/core';
import { Purchase } from '../core/entity/purchase';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Observable } from 'rxjs';
import { User } from '../core/entity/user';
import { UserSelectors } from '../store/selectors/user.selectors';
import { PurchaseSelectors } from '../store/selectors/purchase.selectors';
import { take } from "rxjs/operators";
import { PurchaseActions } from "../store/actions/purchase.actions";


@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.scss']
})
export class PurchaseViewComponent implements OnInit {

  // FIXME: Load entity data if not present.
  private purchase: Purchase;
  private user$: Observable<User>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(PurchaseSelectors.selectCurrentPurchase)
      .pipe(take(1))
      .subscribe((purchase) => {
      this.purchase = purchase;
      this.user$ = this.selectUserById(purchase.buyerId);
    })
  }

  selectUserById(id: string): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

  onDeleteButtonClick(): void {
    this.store.dispatch(PurchaseActions.deletePurchase({purchase: this.purchase}));
  }

}
