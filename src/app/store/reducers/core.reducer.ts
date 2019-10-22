import { Action, createReducer, on } from "@ngrx/store";
import * as CoreActions from '../actions/core.actions';
import { CoreState, initialState } from "../states/core.state";


const coreReducer = createReducer(
  initialState,
  on(CoreActions.requestUserData, (state) => ({
    ...state,
    userDataLoading: true
  })),
  on(CoreActions.userDataReceived, (state, {users}) => ({
    ...state,
    users: users,
    userDataLoading: false
  })),
  on(CoreActions.requestTransactionData, (state) => ({
    ...state,
    transactionDataLoading: true
  })),
  on(CoreActions.transactionDataReceived, (state, {transactions}) => ({
    ...state,
    transactions:transactions,
    transactionDataLoading: false
  })),
  on(CoreActions.requestPaymentData, (state) => ({
    ...state,
    paymentDataLoading: true
  })),
  on(CoreActions.paymentDataReceived, (state, {payment}) => ({
    ...state,
    payment: payment,
    paymentDataLoading: false
  })),
  on(CoreActions.clearPaymentData, (state) => ({
    ...state,
    payment: null,
    paymentDataLoading: false
  })),
  on(CoreActions.addNewPayment, (state, {payment}) => ({
    ...state,
    payment: payment,
    transactions: [...state.transactions, payment.transaction]
  })),
  on(CoreActions.paymentUploadFailed, (state, {transactionId}) => ({
    ...state,
    transactions: state.transactions.filter(transaction => transaction.transactionId !== transactionId)
  }))
);

export function reducer(state: CoreState | undefined, action: Action) {
  return coreReducer(state, action);
}
