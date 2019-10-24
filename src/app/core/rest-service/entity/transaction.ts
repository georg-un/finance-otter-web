export class Transaction {
  transactionId: string;
  userId: number;
  date: number;
  category: string;
  shop: string;
  description: string;
  billId: string;
  syncStatus: SyncStatusEnum;
  sumAmount: number;
}

export enum SyncStatusEnum {
  Local = 'local',
  Remote = 'remote',
  Syncing = 'syncing'
}
