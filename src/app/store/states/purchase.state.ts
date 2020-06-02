import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Purchase } from '../../core/entity/purchase';

export interface PurchaseState extends EntityState<Purchase> {
  syncJobs: number;
}

export function sortByDate(a: Purchase, b: Purchase): number {
  if (a.date > b.date) {
    return -1;
  } else if (a.date < b.date) {
    return 1;
  } else {
    return 0;
  }
}

export const purchaseAdapter: EntityAdapter<Purchase> = createEntityAdapter<Purchase>({
  selectId: (purchase: Purchase) => purchase.purchaseId,
  sortComparer: sortByDate
});

export const initialState: PurchaseState = purchaseAdapter.getInitialState({
  syncJobs: 0,
  sortComparer: sortByDate,
});
