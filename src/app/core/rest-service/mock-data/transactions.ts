import { SyncStatusEnum, Transaction } from '../entity/transaction';

export const TRANSACTIONS: Transaction[] = [
  {
    transactionId: 'rfSf.1554415200743',
    userId: 1,
    date: 1554415200000,
    category: 'Groceries',
    shop: 'Bio Shop',
    description: 'Needed stuff',
    syncStatus: SyncStatusEnum.Remote,
    billId: null,
    sumAmount: 40.86
  },
  {
    transactionId: 'rfBs.1554415200833',
    userId: 2,
    date: 1554415200000,
    category: 'Pets',
    shop: 'Pet Store',
    description: 'Bought new dog food',
    syncStatus: SyncStatusEnum.Remote,
    billId: null,
    sumAmount: 64.02
  },
  {
    transactionId: 'rSfv.1554415207443',
    userId: 3,
    date: 1554415200000,
    category: 'Hygiene',
    shop: 'Drugstore',
    description: null,
    syncStatus: SyncStatusEnum.Remote,
    billId: null,
    sumAmount: 22.32
  }
];
