import { LayoutState } from './layout.state';
import { PurchaseState } from './purchase.state';
import { UserState } from './user.state';
import { RouterReducerState } from '@ngrx/router-store';
import { SummaryState } from './summary.state';
import { CategoryState } from './category.state';

export interface AppState {
  users: UserState;
  purchases: PurchaseState;
  categories: CategoryState;
  layout: LayoutState;
  router: RouterReducerState;
  summary: SummaryState;
}
