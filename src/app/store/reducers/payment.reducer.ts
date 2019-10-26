import { Action, createReducer, on } from "@ngrx/store";
import { initialState, paymentAdapter, PaymentState } from "../states/payment.state";
import * as PaymentActions from "../actions/payment.actions";


const paymentReducer = createReducer(
  initialState,
  on(PaymentActions.addPayment, (state, { payment }) => {
    return paymentAdapter.addOne(payment, state)
  }),
  on(PaymentActions.addPayments, (state, { payments }) => {
    return paymentAdapter.addMany(payments, state);
  }),
  on(PaymentActions.updatePayment, (state, { payment }) => {
    return paymentAdapter.updateOne(payment, state);
  }),
  on(PaymentActions.updatePayments, (state, { payments }) => {
    return paymentAdapter.updateMany(payments, state);
  }),
  on(PaymentActions.replacePayments, (state, { payments }) => {
    return paymentAdapter.addAll(payments, state);
  }),
  on(PaymentActions.clearPayments, state => {
    return paymentAdapter.removeAll(state);
  }),
  on(PaymentActions.requestPayments, state => (
    {...state, syncJobs: state.syncJobs + 1}
  )),
  on(PaymentActions.paymentsReceived, (state, { payments }) => {
    return paymentAdapter.addMany(payments, {...state, syncJobs: state.syncJobs - 1});
  }),
  on(PaymentActions.requestSinglePayment, state => (
    {...state, isSyncing: true}
  )),
  on(PaymentActions.singlePaymentReceived, (state, { payment }) => {
    return paymentAdapter.addOne(payment, {...state, syncJobs: state.syncJobs - 1});
  }),
  on(PaymentActions.addNewPayment, (state, { payment }) => {
    return paymentAdapter.addOne(payment, {...state, syncJobs: state.syncJobs + 1});
  }),
  on(PaymentActions.paymentUploadSuccessful, (state, { payment }) => {
    return paymentAdapter.updateOne(payment, {...state, syncJobs: state.syncJobs - 1});
  })
);


export function reducer(state: PaymentState | undefined, action: Action) {
  return paymentReducer(state, action);
}
