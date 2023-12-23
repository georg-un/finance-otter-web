import { PurchaseDTO } from '../../../../domain';

export interface Purchase {
  uid?: string;
  buyerUid: string;
  shop: string;
  date: number
  category: string;
  description?: string;
  debits: Debits;
  isCompensation?: boolean;
}

export interface Debits {
  [debtorUid: string]: number;
}

export function purchaseFromPurchaseDTO(uid: string, purchaseDTO: PurchaseDTO): Purchase {
  return { uid, ...purchaseDTO };
}
