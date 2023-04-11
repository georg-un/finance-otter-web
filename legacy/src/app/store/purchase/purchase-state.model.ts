import { EntityStateModel } from '../utils/entity-state.model';
import { Purchase } from '../../core/entity/purchase';
import { Pagination } from '../../core/entity/pagination';

export interface PurchaseStateModel extends EntityStateModel<Purchase> {
  isLoading: boolean;
  pagination: Pagination;
}

export const DEFAULT_PURCHASE_STATE: PurchaseStateModel = {
  entities: {},
  entityIds: [],
  isLoading: false,
  pagination: {offset: 0, limit: 15},
};
