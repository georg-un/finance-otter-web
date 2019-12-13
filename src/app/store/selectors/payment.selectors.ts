import { paymentAdapter } from '../states/payment.state';
import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { Payment } from '../../core/rest-service/entity/payment';

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

export const selectPaymentById = () => {
  return createSelector(
    selectPaymentEntities,
    (entities: Dictionary<Payment>, props: { id: string }) => {
      return entities[props.id];
    },
  );
};
