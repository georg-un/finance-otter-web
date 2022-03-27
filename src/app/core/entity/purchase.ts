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
  Local = 'local',
  LocalUpdate = 'localUpdate',
  LocalDelete = 'localDelete',
  Syncing = 'syncing',
  Remote = 'remote',
  Error = 'error'
}
