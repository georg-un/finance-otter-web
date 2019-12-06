import { LayoutState } from './layout.state';
import { PaymentState } from './payment.state';
import { UserState } from './user.state';

export interface AppState {
  users: UserState,
  payments: PaymentState,
  layout: LayoutState
}
