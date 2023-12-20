import { isNumber, isObject, isString } from './type-guards';

export interface PurchaseDTO {
    uid?: string;
    buyerUid: string;
    shop: string;
    date: number
    debits: DebitDTO;
    category: string;
    description?: string;
    isCompensation?: boolean;
}

export interface DebitDTO {
    [debtorUid: string]: number;
}

export const isPurchaseDTO = (val: unknown): val is PurchaseDTO => {
    return isObject(val) &&
        isString((val as PurchaseDTO).buyerUid) &&
        isString((val as PurchaseDTO).shop) &&
        isNumber((val as PurchaseDTO).date) &&
        isDebitDTO((val as PurchaseDTO).debits);
}

export const isDebitDTO = (val: unknown): val is DebitDTO => {
    return isObject(val) && Object.entries(val).every(([key, value]: [string, number]) => isString(key) && isNumber(value));
}
