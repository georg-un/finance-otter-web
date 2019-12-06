import { paymentAdapter } from '../states/payment.state';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = paymentAdapter.getSelectors();

export const selectPaymentIds = selectIds;
export const selectPaymentEntities = selectEntities;
export const selectAllPayments = selectAll;
export const selectPaymentCount = selectTotal;
