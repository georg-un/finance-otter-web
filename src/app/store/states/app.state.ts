import { CoreState } from "./core.state";
import { LayoutState } from "./layout.state";
import { TransactionState } from "./transaction.state";

export interface AppState {
  core: CoreState,
  transactions: TransactionState,
  layout: LayoutState
}
