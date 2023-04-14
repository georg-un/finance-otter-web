export interface Purchase {
  uid?: string;
  buyerUid: string;
  shop: string;
  date: number
  category: string;
  description: string;
  debits: { [debtorUid: string]: number };
}

export interface Category {
  color: string;
  active: boolean;
}
