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
