import { paymentAdapter } from '../states/payment.state';
import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = paymentAdapter.getSelectors();

const selectPayments = (state: AppState) => state.payments;

export const selectPaymentIds = createSelector(selectPayments, selectIds);
export const selectPaymentEntities = createSelector(selectPayments, selectEntities);
export const selectAllPayments = createSelector(selectPayments, selectAll);
export const selectPaymentCount = createSelector(selectPayments, selectTotal);

export const selectPaymentById = createSelector(
  selectPayments,
  payments => (id: number) => payments[id]
);
