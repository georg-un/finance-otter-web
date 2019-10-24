import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { SyncStatusEnum, Transaction } from "../../core/rest-service/entity/transaction";

export interface TransactionState extends EntityState<Transaction> {
  syncState: SyncStatusEnum;
}

export const transactionAdapter: EntityAdapter<Transaction> = createEntityAdapter<Transaction>();

export function sortByDate(a: Transaction, b: Transaction): number {
  if (a.date > b.date)  return 1;
  else if (a.date < b.date) return -1;
  else return 0;
}

export const initialState: TransactionState = transactionAdapter.getInitialState({
  syncState: null,
  sortComparer: sortByDate,
});
