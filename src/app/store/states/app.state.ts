import { CoreState } from "./core.state";
import { LayoutState } from "./layout.state";
import { PaymentState } from "./payment.state";

export interface AppState {
  core: CoreState,
  payments: PaymentState,
  layout: LayoutState
}
