import { Debit } from './debit';

export class Payment {
  paymentId: string;
  userId: number;
  date: number;
  category: string;
  shop: string;
  description: string;
  billId: string;
  syncStatus: SyncStatusEnum;
  sumAmount: number;
  debits: Debit[];
}

export enum SyncStatusEnum {
  Local = 'local',
  LocalUpdate = 'localUpdate',
  LocalDelete = 'localDelete',
  Syncing = 'syncing',
  Remote = 'remote'
}
