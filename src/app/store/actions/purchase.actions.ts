import { createAction, props } from '@ngrx/store';
import { Purchase } from '../../core/entity/purchase';
import { Update } from '@ngrx/entity';

export class PurchaseActions {
  static addPurchaseEntity = createAction('[Purchase] Add Purchase Entity', props<{ purchase: Purchase }>());
  static updatePurchaseEntity = createAction('[Purchase] Update Purchase Entity', props<{ purchase: Update<Purchase> }>());

  static requestPurchases = createAction('[Purchase] Request Purchases', props<{offset: number, limit: number}>());
  static purchasesReceived = createAction('[Purchase] Purchases Received', props<{purchases: Purchase[]}>());
  static requestSinglePurchase = createAction('[Purchase] Request Single Purchase', props<{purchaseId: string}>());
  static singlePurchaseReceived = createAction('[Purchase] Single Purchase Received', props<{purchase: Purchase}>());
  static addNewPurchase = createAction('[Purchase] Add New Purchase', props<{purchase: Purchase, receipt: Blob}>());
  static updatePurchase = createAction('[Purchase] Update Purchase', props<{purchase: Purchase}>());
  static deletePurchase = createAction('[Purchase] Delete Purchase', props<{purchase: Purchase}>());
  static updateReceipt = createAction('[Purchase] Update Receipt', props<{purchaseId: string, receipt: Blob}>());
  static deleteReceipt = createAction('[Purchase] Delete Receipt', props<{purchaseId: string}>());
  static purchaseUploadSuccessful = createAction('[Purchase] Purchase Upload Successful', props<{purchase: Purchase}>());
  static purchaseUploadFailed = createAction('[Purchase] Purchase Upload Failed', props<{purchaseId: string}>());
  static purchaseUpdateSuccessful = createAction('[Purchase] Purchase Update Successful', props<{purchase: Purchase}>());
  static purchaseUpdateFailed = createAction('[Purchase] Purchase Update Failed', props<{purchaseId: string}>());
  static purchaseDeleteSuccessful = createAction('[Purchase] Purchase Delete Successful', props<{purchaseId: string}>());
  static purchaseDeleteFailed = createAction('[Purchase] Purchase Delete Failed', props<{purchase: Purchase}>());
  static receiptUpdateSuccessful = createAction('[Purchase] Receipt Update Successful', props<{purchaseId: string}>());
  static receiptUpdateFailed = createAction('[Purchase] Receipt Update Failed', props<{purchaseId: string}>());
}
