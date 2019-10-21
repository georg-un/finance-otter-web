import { createAction, props } from "@ngrx/store";
import { User } from "../../core/rest-service/entity/user";
import { Transaction } from "../../core/rest-service/entity/transaction";
import { Payment } from "../../core/rest-service/entity/payment";

export const requestUserData = createAction(
  '[Core] Request User Data'
);

export const userDataReceived = createAction(
  '[Core] User Data Received',
  props<{users: User[]}>()
);

export const requestTransactionData = createAction(
  '[Core] Request Transaction Data',
  props<{offset: number, limit: number}>()
);

export const transactionDataReceived = createAction(
  '[Core] Transaction Data Received',
  props<{transactions: Transaction[]}>()
);

export const requestPaymentData = createAction(
  '[Core] Request Payment Data',
  props<{transactionId: number}>()
);

export const paymentDataReceived = createAction(
  '[Core] Payment Data Received',
  props<{payment: Payment}>()
);

export const clearPaymentData = createAction(
  '[Core] Clear Payment Data'
);
