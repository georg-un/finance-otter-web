import { createAction, props } from "@ngrx/store";
import { User } from "../../core/rest-service/entity/user";
import { Payment } from "../../core/rest-service/entity/payment";

export const requestUserData = createAction(
  '[Core] Request User Data'
);

export const userDataReceived = createAction(
  '[Core] User Data Received',
  props<{users: User[]}>()
);

export const requestPaymentData = createAction(
  '[Core] Request Payment Data',
  props<{transactionId: number}>()
);

export const paymentDataReceived = createAction(
  '[Core] Payment Data Received',
  props<{payment: Payment}>()
);
