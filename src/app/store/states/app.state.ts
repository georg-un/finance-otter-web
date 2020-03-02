import { LayoutState } from './layout.state';
import { PurchaseState } from './purchase.state';
import { UserState } from './user.state';
import { RouterReducerState } from '@ngrx/router-store';

export interface AppState {
  users: UserState;
  purchases: PurchaseState;
  layout: LayoutState;
  router: RouterReducerState;
}
