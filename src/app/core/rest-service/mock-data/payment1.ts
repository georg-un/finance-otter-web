import { Payment } from '../entity/payment';
import { SyncStatusEnum } from "../entity/transaction";

export const PAYMENT1: Payment =
  {
    transaction: {
      date: 1554415200000,
      category: 'Groceries',
      shop: 'Bio Shop',
      description: null,
      billId: null,
      userId: 1,
      transactionId: 'krSe.1554415200000',
      syncStatus: SyncStatusEnum.Remote,
      sumAmount: 40.86
    },
    debits: [
      {
        debitId: 'krSe.15544152000234',
        debtorId: 2,
        amount: 20.43
      },
      {
        debitId: 'krSe.15544152000456',
        debtorId: 3,
        amount: 20.43
      }
    ]
  };
