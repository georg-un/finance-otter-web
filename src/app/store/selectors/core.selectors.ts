import { AppState } from "../app.state";

export const selectPayment = (state: AppState) => state.core.payment;

export const selectTransactions = (state: AppState) => state.core.transactions;
