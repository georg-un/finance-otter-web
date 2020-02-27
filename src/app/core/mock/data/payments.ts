import { Payment, SyncStatusEnum } from '../../entity/payment';

export const PAYMENTS: Payment[] = [
  {
    paymentId: 'rfSf.1554415200743',
    userId: 1,
    date: 1554415200000,
    category: 'groceries',
    shop: 'Bio Shop',
    description: 'Needed stuff',
    syncStatus: SyncStatusEnum.Remote,
    billId: null,
    sumAmount: 40.86,
    debits: [
      {
        debitId: 'krSe.15544152000224',
        debtorId: 2,
        amount: 20.43
      },
      {
        debitId: 'krSe.15544152000466',
        debtorId: 3,
        amount: 20.43
      }
    ]
  },
  {
    paymentId: 'rfBs.1554415200833',
    userId: 2,
    date: 1554415200000,
    category: 'pets',
    shop: 'Pet Store',
    description: 'Bought new dog food',
    syncStatus: SyncStatusEnum.Syncing,
    billId: null,
    sumAmount: 64.02,
    debits: [
      {
        debitId: 'krSe.15542152000224',
        debtorId: 1,
        amount: 21.34
      },
      {
        debitId: 'krSe.15544155000466',
        debtorId: 3,
        amount: 21.34
      }
    ]
  },
  {
    paymentId: 'rSfv.1554415207443',
    userId: 3,
    date: 1554415200000,
    category: 'hygiene',
    shop: 'Drugstore',
    description: null,
    syncStatus: SyncStatusEnum.LocalDelete,
    billId: null,
    sumAmount: 22.32,
    debits: [
      {
        debitId: 'krSe.15544152500224',
        debtorId: 1,
        amount: 7.44
      },
      {
        debitId: 'krSe.15544152000426',
        debtorId: 2,
        amount: 7.44
      }
    ]
  }
];
