import { User } from "../../core/rest-service/entity/user";
import { Transaction } from "../../core/rest-service/entity/transaction";
import { Payment } from "../../core/rest-service/entity/payment";

export interface CoreState {
  users: User[],
  currentUserId: number,
  userDataLoading: boolean
  transactions: Transaction[],
  transactionDataLoading: boolean,
  payment: Payment,
  paymentDataLoading: boolean
}

export const initialState: CoreState = {
  users: null,
  currentUserId: 1,
  userDataLoading: false,
  transactions: null,
  transactionDataLoading: false,
  payment: null,
  paymentDataLoading: false
};
