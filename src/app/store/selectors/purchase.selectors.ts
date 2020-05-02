import { purchaseAdapter } from '../states/purchase.state';
import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { Purchase } from '../../core/entity/purchase';
import { RouterSelectors } from './router.selectors';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = purchaseAdapter.getSelectors();

const selectPurchases = (state: AppState) => state.purchases;

export class PurchaseSelectors {

  static selectPurchaseIds = createSelector(selectPurchases, selectIds);
  static selectPurchaseEntities = createSelector(selectPurchases, selectEntities);
  static selectAllPurchases = createSelector(selectPurchases, selectAll);
  static selectPurchaseCount = createSelector(selectPurchases, selectTotal);
  static selectSyncJobs = createSelector(selectPurchases, state => state.syncJobs);

  static selectCurrentPurchase = createSelector(
    PurchaseSelectors.selectPurchaseEntities,
    RouterSelectors.selectPurchaseId,
    (entities: Dictionary<Purchase>, purchaseId: string) => {
      if (!purchaseId) {
        return undefined;
      } else if (!entities) {
        console.error('No entities in store.');
        return undefined;
      } else {
        return entities[purchaseId];
      }
    }
  );

  static selectPurchaseById = (id: string) => createSelector(
    PurchaseSelectors.selectPurchaseEntities,
    entities => entities[id]
  );

}
