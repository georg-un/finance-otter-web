import { Action, createReducer } from "@ngrx/store";
import { initialState, TransactionState } from "../states/transaction.state";

const transactionReducer = createReducer(initialState);

export function reducer(state: TransactionState | undefined, action: Action) {
  return transactionReducer(state, action);
}
