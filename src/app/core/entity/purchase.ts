import { Debit } from './debit';

export class Purchase {
  purchaseId: string;
  buyerId: string;
  date: number;
  category: string;
  shop: string;
  description: string;
  syncStatus: SyncStatusEnum;
  debits: Debit[];
}

export enum SyncStatusEnum {
  Local = 'local',
  LocalUpdate = 'localUpdate',
  LocalDelete = 'localDelete',
  Syncing = 'syncing',
  Remote = 'remote'
}
