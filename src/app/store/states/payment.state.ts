import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Payment, SyncStatusEnum } from "../../core/rest-service/entity/payment";

export interface PaymentState extends EntityState<Payment> {
  syncState: SyncStatusEnum;
}

export const paymentAdapter: EntityAdapter<Payment> = createEntityAdapter<Payment>({
  selectId: (payment: Payment) => payment.paymentId
});

export function sortByDate(a: Payment, b: Payment): number {
  if (a.date > b.date)  return 1;
  else if (a.date < b.date) return -1;
  else return 0;
}

export const initialState: PaymentState = paymentAdapter.getInitialState({
  syncState: null,
  sortComparer: sortByDate,
});
