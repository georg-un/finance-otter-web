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

export class PaymentSelectors {

  static selectPaymentIds = createSelector(selectPayments, selectIds);
  static selectPaymentEntities = createSelector(selectPayments, selectEntities);
  static selectAllPayments = createSelector(selectPayments, selectAll);
  static selectPaymentCount = createSelector(selectPayments, selectTotal);

  static selectPaymentById = () => {
    return createSelector(
      PaymentSelectors.selectPaymentEntities,
      (entities: Dictionary<Payment>, props: { id: string }) => {
        return entities[props.id];
      },
    );
  }

}
