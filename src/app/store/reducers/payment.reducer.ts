import { Action, createReducer } from "@ngrx/store";
import { initialState, PaymentState } from "../states/payment.state";

const paymentReducer = createReducer(initialState);

export function reducer(state: PaymentState | undefined, action: Action) {
  return paymentReducer(state, action);
}
