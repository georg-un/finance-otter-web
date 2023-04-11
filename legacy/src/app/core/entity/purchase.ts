import { Debit } from './debit';

export interface Purchase {
  purchaseId: string;
  buyerId: string;
  date: number;
  categoryId: number;
  shop: string;
  description: string;
  isCompensation: boolean;
  syncStatus: SyncStatusEnum;
  debits: Debit[];
}

export enum SyncStatusEnum {
  Syncing = 'syncing',
  Remote = 'remote',
  Error = 'error'
}
