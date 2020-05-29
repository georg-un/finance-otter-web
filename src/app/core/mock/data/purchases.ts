import { Purchase, SyncStatusEnum } from '../../entity/purchase';

export const PURCHASES: Purchase[] = [
  {
    purchaseId: 'rfSf.1554415200743',
    buyerId: '1',
    date: 1554415200000,
    categoryId: 0,
    shop: 'Bio Shop',
    description: 'Needed stuff',
    isCompensation: false,
    syncStatus: SyncStatusEnum.Remote,
    debits: [
      {
        debitId: 'krSe.15544152456224',
        debtorId: '1',
        amount: 20.43
      },
      {
        debitId: 'krSe.15544152000224',
        debtorId: '2',
        amount: 20.43
      },
      {
        debitId: 'krSe.15544152000466',
        debtorId: '3',
        amount: 20.43
      }
    ]
  },
  {
    purchaseId: 'rfBs.1554415200833',
    buyerId: '2',
    date: 1554415200000,
    categoryId: 1,
    shop: 'Pet Store',
    description: 'Bought new dog food',
    isCompensation: false,
    syncStatus: SyncStatusEnum.Syncing,
    debits: [
      {
        debitId: 'krSe.15542152000224',
        debtorId: '1',
        amount: 21.34
      },
      {
        debitId: 'krSe.15544155000466',
        debtorId: '3',
        amount: 21.34
      }
    ]
  },
  {
    purchaseId: 'rSfv.1554415207443',
    buyerId: '3',
    date: 1554415200000,
    categoryId: 2,
    shop: 'Drugstore',
    description: null,
    isCompensation: false,
    syncStatus: SyncStatusEnum.LocalDelete,
    debits: [
      {
        debitId: 'krSe.15544152500224',
        debtorId: '1',
        amount: 7.44
      },
      {
        debitId: 'krSe.15544152000426',
        debtorId: '2',
        amount: 7.44
      }
    ]
  }
];
