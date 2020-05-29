import { Purchase, SyncStatusEnum } from '../../entity/purchase';

export const PURCHASE1: Purchase = {
  purchaseId: 'krSe.1554415200000',
  date: 1554415200000,
  categoryId: 0,
  shop: 'Bio Shop',
  description: null,
  isCompensation: false,
  buyerId: '1',
  syncStatus: SyncStatusEnum.Remote,
  debits: [
    {
      debitId: 'krSe.15544152000234',
      debtorId: '2',
      amount: 20.43
    },
    {
      debitId: 'krSe.15544152000456',
      debtorId: '3',
      amount: 20.43
    }
  ]
};
