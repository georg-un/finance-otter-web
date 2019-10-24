import { transactionAdapter } from "../states/transaction.state";

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = transactionAdapter.getSelectors();

export const selectTransactionIds = selectIds;
export const selectTransactionEntities = selectEntities;
export const selectAllTransactions = selectAll;
export const selectTransactionCount = selectTotal;
