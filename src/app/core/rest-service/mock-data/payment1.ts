import { Payment } from '../entity/payment';

export const PAYMENT1: Payment =
  {
    transaction: {
      date: new Date(1554415200000),
      category: 'Groceries',
      shop: 'Bio Shop',
      description: null,
      billId: null,
      userId: 1,
      transactionId: 1,
      sumAmount: 40.86
    },
    debits: [
      {
        debitId: 1,
        debtorId: 2,
        amount: 20.43
      },
      {
        debitId: 2,
        debtorId: 3,
        amount: 20.43
      }
    ]
  };
