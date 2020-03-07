import { Action, createReducer, on } from '@ngrx/store';
import { initialState, purchaseAdapter, PurchaseState } from '../states/purchase.state';
import { PurchaseActions } from '../actions/purchase.actions';


const purchaseReducer = createReducer(
  initialState,
  on(PurchaseActions.addPurchaseEntity, (state, { purchase }) => {
    return purchaseAdapter.addOne(purchase, state);
  }),
  on(PurchaseActions.addPurchaseEntities, (state, { purchases }) => {
    return purchaseAdapter.addMany(purchases, state);
  }),
  on(PurchaseActions.updatePurchaseEntity, (state, { purchase }) => {
    return purchaseAdapter.updateOne(purchase, state);
  }),
  on(PurchaseActions.updatePurchaseEntities, (state, { purchases }) => {
    return purchaseAdapter.updateMany(purchases, state);
  }),
  on(PurchaseActions.replacePurchaseEntities, (state, { purchases }) => {
    return purchaseAdapter.addAll(purchases, state);
  }),
  on(PurchaseActions.clearPurchaseEntities, state => {
    return purchaseAdapter.removeAll(state);
  }),
  on(PurchaseActions.requestPurchases, state => {
    return  {...state, syncJobs: state.syncJobs + 1};
  }),
  on(PurchaseActions.purchasesReceived, (state, { purchases }) => {
    return purchaseAdapter.addMany(purchases, {...state, syncJobs: state.syncJobs - 1});
  }),
  on(PurchaseActions.requestSinglePurchase, state => {
    return {...state, syncJobs: state.syncJobs + 1};
  }),
  on(PurchaseActions.singlePurchaseReceived, (state, { purchase }) => {
    return purchaseAdapter.addOne(purchase, {...state, syncJobs: state.syncJobs - 1});
  }),
  on(PurchaseActions.addNewPurchase, (state, { purchase }) => {
    return purchaseAdapter.addOne(purchase, {...state, syncJobs: state.syncJobs + 1});
  }),
  on(PurchaseActions.updatePurchase, (state, { purchase }) => {
    return {...state, syncJobs: state.syncJobs + 1};
  }),
  on(PurchaseActions.deletePurchase, (state, { purchase }) => {
    return purchaseAdapter.removeOne(purchase.purchaseId, {...state, syncJobs: state.syncJobs + 1});
  }),
  on(PurchaseActions.purchaseUploadSuccessful, (state, { purchase }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PurchaseActions.purchaseUploadFailed, (state, { purchaseId }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PurchaseActions.purchaseUpdateSuccessful, (state, { purchase }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PurchaseActions.purchaseUpdateFailed, (state, { purchaseId }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PurchaseActions.purchaseDeleteSuccessful, (state, { purchaseId }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
  on(PurchaseActions.purchaseDeleteFailed, (state, { purchase }) => {
    return {...state, syncJobs: state.syncJobs - 1};
  }),
);


export function reducer(state: PurchaseState | undefined, action: Action) {
  return purchaseReducer(state, action);
}
