import { isNumber, isObject, isString } from './type-guards';

interface Transaction {
    type: 'purchase' | 'compensation';
    payerUid: string;
    date: number
    debits: DebitDTO;
    description?: string;
}

export interface PurchaseDTO extends Transaction {
    shop: string;
    categoryUid: string;
    receiptName?: string;
    type: 'purchase';
}

export interface CompensationDTO extends Transaction {
    type: 'compensation';
}

export interface DebitDTO {
    [debtorUid: string]: number;
}

const isTransaction = (val: unknown): val is Transaction => {
    return isObject(val) &&
      isString((val as Transaction).payerUid) &&
      isNumber((val as Transaction).date) &&
      isDebitDTO((val as Transaction).debits);
}

export const isPurchaseDTO = (val: unknown): val is PurchaseDTO => {
    return isTransaction(val) &&
      (val as PurchaseDTO).type === 'purchase' &&
      isString((val as PurchaseDTO).shop) &&
      isString((val as PurchaseDTO).categoryUid);
}

export const isCompensationDTO = (val: unknown): val is CompensationDTO => {
    return isTransaction(val) && (val as CompensationDTO).type === 'compensation';
}

export const isDebitDTO = (val: unknown): val is DebitDTO => {
    return isObject(val) && Object.entries(val).every(([key, value]: [string, number]) => isString(key) && isNumber(value));
}
