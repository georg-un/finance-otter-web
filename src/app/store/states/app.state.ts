import { LayoutState } from './layout.state';
import { PaymentState } from './payment.state';
import { UserState } from './user.state';
import { RouterReducerState } from '@ngrx/router-store';

export interface AppState {
  users: UserState;
  payments: PaymentState;
  layout: LayoutState;
  router: RouterReducerState;
}
