import {Purchase, SyncStatusEnum} from '../../entity/purchase';

export const DEMO_PURCHASES: Purchase[] = [
  {
    buyerId: 'user3',
    categoryId: 1,
    date: 1590270491000,
    debits: [
      {
        amount: 3.45,
        debitId: 'initDebitId20',
        debtorId: 'user2'
      },
      {
        amount: 3.45,
        debitId: 'initDebitId21',
        debtorId: 'user3'
      }
    ],
    purchaseId: 'initPurchaseId9',
    shop: 'Billa',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user3',
    categoryId: 1,
    date: 1587851291000,
    debits: [
      {
        amount: 23.56,
        debitId: 'initDebitId22',
        debtorId: 'user2'
      },
      {
        amount: 23.56,
        debitId: 'initDebitId23',
        debtorId: 'user3'
      }
    ],
    purchaseId: 'initPurchaseId10',
    shop: 'Bierkanter',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user3',
    categoryId: 1,
    date: 1586987291000,
    debits: [
      {
        amount: 26.8,
        debitId: 'initDebitId10',
        debtorId: 'user1'
      },
      {
        amount: 26.8,
        debitId: 'initDebitId12',
        debtorId: 'user3'
      },
      {
        amount: 26.8,
        debitId: 'initDebitId11',
        debtorId: 'user2'
      }
    ],
    purchaseId: 'initPurchaseId5',
    shop: 'Hofer',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user2',
    date: 1582467716000,
    debits: [
      {
        amount: 20.0,
        debitId: 'initDebitId9',
        debtorId: 'user3'
      }
    ],
    isCompensation: true,
    purchaseId: 'initPurchaseId4',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user2',
    categoryId: 1,
    date: 1581806891000,
    debits: [
      {
        amount: 23.45,
        debitId: 'initDebitId7',
        debtorId: 'user2'
      },
      {
        amount: 23.45,
        debitId: 'initDebitId8',
        debtorId: 'user3'
      }
    ],
    purchaseId: 'initPurchaseId3',
    shop: 'Bierkanter',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user1',
    categoryId: 1,
    date: 1581806891000,
    debits: [
      {
        amount: 10.0,
        debitId: 'initDebitId26',
        debtorId: 'user3'
      },
      {
        amount: 10.0,
        debitId: 'initDebitId25',
        debtorId: 'user2'
      },
      {
        amount: 10.0,
        debitId: 'initDebitId24',
        debtorId: 'user2'
      }
    ],
    purchaseId: 'initPurchaseId11',
    shop: 'Brunnenmarkt',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user1',
    categoryId: 3,
    date: 1581806891000,
    debits: [
      {
        amount: 12.5,
        debitId: 'initDebitId19',
        debtorId: 'user3'
      },
      {
        amount: 12.5,
        debitId: 'initDebitId17',
        debtorId: 'user1'
      },
      {
        amount: 12.5,
        debitId: 'initDebitId18',
        debtorId: 'user2'
      }
    ],
    purchaseId: 'initPurchaseId8',
    shop: 'GRU',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user2',
    categoryId: 3,
    date: 1580856491000,
    debits: [
      {
        amount: 24.5,
        debitId: 'initDebitId13',
        debtorId: 'user2'
      },
      {
        amount: 23.45,
        debitId: 'initDebitId14',
        debtorId: 'user3'
      }
    ],
    purchaseId: 'initPurchaseId6',
    shop: 'GRU',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user1',
    categoryId: 1,
    date: 1580805505000,
    debits: [
      {
        amount: 12.3,
        debitId: 'initDebitId2',
        debtorId: 'user2'
      },
      {
        amount: 23.56,
        debitId: 'initDebitId1',
        debtorId: 'user1'
      },
      {
        amount: 12.3,
        debitId: 'initDebitId3',
        debtorId: 'user3'
      }
    ],
    description: 'needed chocolate',
    purchaseId: 'initPurchaseId1',
    shop: 'BILLA',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user1',
    categoryId: 4,
    date: 1579906091000,
    debits: [
      {
        amount: 14.4,
        debitId: 'initDebitId27',
        debtorId: 'user1'
      },
      {
        amount: 14.4,
        debitId: 'initDebitId28',
        debtorId: 'user2'
      }
    ],
    purchaseId: 'initPurchaseId12',
    shop: 'Staatsoper',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user1',
    date: 1579098116000,
    debits: [
      {
        amount: 38.0,
        debitId: 'initDebitId29',
        debtorId: 'user3'
      }
    ],
    isCompensation: true,
    purchaseId: 'initPurchaseId13',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user2',
    categoryId: 3,
    date: 1578610091000,
    debits: [
      {
        amount: 23.45,
        debitId: 'initDebitId15',
        debtorId: 'user2'
      },
      {
        amount: 23.45,
        debitId: 'initDebitId16',
        debtorId: 'user3'
      }
    ],
    purchaseId: 'initPurchaseId7',
    shop: 'Itoya Sushi',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user1',
    categoryId: 5,
    date: 1577833200000,
    debits: [
      {
        amount: 48.5,
        debitId: 'initDebitId32',
        debtorId: 'user3'
      },
      {
        amount: 48.5,
        debitId: 'initDebitId30',
        debtorId: 'user1'
      },
      {
        amount: 48.5,
        debitId: 'initDebitId31',
        debtorId: 'user2'
      }
    ],
    purchaseId: 'initPurchaseId14',
    shop: 'Strom',
    syncStatus: SyncStatusEnum.Remote
  },
  {
    buyerId: 'user2',
    categoryId: 2,
    date: 1577542534000,
    debits: [
      {
        amount: 8.45,
        debitId: 'initDebitId5',
        debtorId: 'user2'
      },
      {
        amount: 8.45,
        debitId: 'initDebitId4',
        debtorId: 'user1'
      },
      {
        amount: 8.45,
        debitId: 'initDebitId6',
        debtorId: 'user3'
      }
    ],
    purchaseId: 'initPurchaseId2',
    shop: 'OBI',
    syncStatus: SyncStatusEnum.Remote
  }
];
