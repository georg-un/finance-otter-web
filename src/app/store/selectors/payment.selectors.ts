import { paymentAdapter } from '../states/payment.state';
import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { Payment } from '../../core/rest-service/entity/payment';
import { RouterSelectors } from './router.selectors';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = paymentAdapter.getSelectors();

const selectPayments = (state: AppState) => state.payments;

export class PaymentSelectors {

  static selectPaymentIds = createSelector(selectPayments, selectIds);
  static selectPaymentEntities = createSelector(selectPayments, selectEntities);
  static selectAllPayments = createSelector(selectPayments, selectAll);
  static selectPaymentCount = createSelector(selectPayments, selectTotal);
  static selectSyncJobs = createSelector(selectPayments, state => state.syncJobs);

  static selectCurrentPayment = createSelector(
    PaymentSelectors.selectPaymentEntities,
    RouterSelectors.selectPaymentId,
    (entities: Dictionary<Payment>, paymentId: string) => {
      if (!paymentId) {
        console.error('No payment found for id: ', paymentId);
        return undefined;
      } else if (!entities) {
        console.error('No entities in store.');
        return undefined;
      } else {
        return entities[paymentId];
      }
    }
  );

  static selectPaymentById = () => {
    return createSelector(
      PaymentSelectors.selectPaymentEntities,
      (entities: Dictionary<Payment>, props: { id: string }) => {
        return entities[props.id];
      },
    );
  }

}
