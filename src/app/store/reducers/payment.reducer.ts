import { Action, createReducer, on } from '@ngrx/store';
import { initialState, paymentAdapter, PaymentState } from '../states/payment.state';
import { PaymentActions } from '../actions/payment.actions';


const paymentReducer = createReducer(
  initialState,
  on(PaymentActions.addPaymentEntity, (state, { payment }) => {
    return paymentAdapter.addOne(payment, state);
  }),
  on(PaymentActions.addPaymentEntities, (state, { payments }) => {
    return paymentAdapter.addMany(payments, state);
  }),
  on(PaymentActions.updatePaymentEntity, (state, { payment }) => {
    return paymentAdapter.updateOne(payment, state);
  }),
  on(PaymentActions.updatePaymentEntities, (state, { payments }) => {
    return paymentAdapter.updateMany(payments, state);
  }),
  on(PaymentActions.replacePaymentEntities, (state, { payments }) => {
    return paymentAdapter.addAll(payments, state);
  }),
  on(PaymentActions.clearPaymentEntities, state => {
    return paymentAdapter.removeAll(state);
  }),
  on(PaymentActions.requestPayments, state => {
    return  {...state, syncJobs: state.syncJobs + 1};
  }),
  on(PaymentActions.paymentsReceived, (state, { payments }) => {
    return paymentAdapter.addMany(payments, {...state, syncJobs: state.syncJobs - 1});
  }),
  on(PaymentActions.requestSinglePayment, state => {
    return {...state, syncJobs: state.syncJobs + 1};
  }),
  on(PaymentActions.singlePaymentReceived, (state, { payment }) => {
    return paymentAdapter.addOne(payment, {...state, syncJobs: state.syncJobs - 1});
  }),
  on(PaymentActions.addNewPayment, (state, { payment }) => {
    return paymentAdapter.addOne(payment, {...state, syncJobs: state.syncJobs + 1});
  }),
  on(PaymentActions.updatePayment, (state, { payment }) => {
    return {...state, syncJobs: state.syncJobs + 1};
  }),
  on(PaymentActions.deletePayment, (state, { payment }) => {
    return paymentAdapter.removeOne(payment.paymentId, {...state, syncJobs: state.syncJobs + 1})
  }),
  on(PaymentActions.paymentUploadSuccessful, (state, { payment }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PaymentActions.paymentUploadFailed, (state, { paymentId }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PaymentActions.paymentUpdateSuccessful, (state, { payment }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PaymentActions.paymentUpdateFailed, (state, { paymentId }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PaymentActions.paymentDeleteSuccessful, (state, { paymentId }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PaymentActions.paymentDeleteFailed, (state, { payment }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
);


export function reducer(state: PaymentState | undefined, action: Action) {
  return paymentReducer(state, action);
}
