import { Pagination } from '../../core/entity/pagination';
import { Purchase } from '../../core/entity/purchase';

export class FetchPurchases {
  public static readonly type = '[PURCHASE] Fetch purchases';
  public static readonly payload: Pagination;
  constructor(public payload: typeof FetchPurchases.payload) {}
}

export class FetchSinglePurchase {
  public static readonly type = '[PURCHASE] Fetch single purchase';
  public static readonly payload: {purchaseId: string};
  constructor(public payload: typeof FetchSinglePurchase.payload) {}
}

export class AddNewPurchase {
  public static readonly type = '[PURCHASE] Add new purchase';
  public static readonly payload: {purchase: Purchase, receipt: Blob};
  constructor(public payload: typeof AddNewPurchase.payload) {}
}

export class UpdatePurchase {
  public static readonly type = '[PURCHASE] Update purchase';
  public static readonly payload: {purchase: Purchase};
  constructor(public payload: typeof UpdatePurchase.payload) {}
}

export class DeletePurchase {
  public static readonly type = '[PURCHASE] Delete purchase';
  public static readonly payload: {purchaseId: string};
  constructor(public payload: typeof DeletePurchase.payload) {}
}

export class UpdateReceipt {
  public static readonly type = '[PURCHASE] Update receipt';
  public static readonly payload: {purchaseId: string, receipt: Blob};
  constructor(public payload: typeof UpdateReceipt.payload) {}
}

export class DeleteReceipt {
  public static readonly type = '[PURCHASE] Delete receipt';
  public static readonly payload: {purchaseId: string};
  constructor(public payload: typeof DeleteReceipt.payload) {}
}
