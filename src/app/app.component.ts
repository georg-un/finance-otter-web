import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/states/app.state';
import { UserActions } from './store/actions/user.actions';
import { PurchaseActions } from './store/actions/purchase.actions';
import { AuthService } from './core/auth.service';
import { UserSelectors } from './store/selectors/user.selectors';
import { CategoryActions } from './store/actions/category.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.store.select(UserSelectors.isCurrentUserActivated)
      .subscribe((isActivated: boolean) => {
        if (isActivated) {
          this.store.dispatch(UserActions.requestUsers());
          this.store.dispatch(CategoryActions.requestCategories());
          this.store.dispatch(PurchaseActions.requestPurchases({offset: 0, limit: 10}));
        } else {
          this.store.dispatch(UserActions.checkIfUserIsActive());
        }
      });
  }

}
