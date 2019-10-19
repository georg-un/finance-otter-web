import { AppState } from "../app.state";

export const selectPayment = (state: AppState) => state.core.payment;
