import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment/moment';
import { DebitFormGroup } from './debit-form-group';

export type ObjectValues<T> = T[keyof T];

export const DISTRIBUTION_MODES = {
  EQUALLY: 'equally',
  CUSTOM: 'custom'
} as const;

export const PURCHASE_FORM_PROPS = {
  SHOP: 'shop',
  CATEGORY: 'category',
  AMOUNT: 'amount',
  DATE: 'date',
  DESCRIPTION: 'description',
  DISTRIBUTION_MODE: 'distributionMode',
  DEBITS: 'debits',
  _RECEIPT_NAME: '_receiptName'
} as const;

export function generateEmptyPurchaseFormGroup() {
  return new FormGroup({
    [PURCHASE_FORM_PROPS.SHOP]: new FormControl(''),
    [PURCHASE_FORM_PROPS.CATEGORY]: new FormControl(''),
    [PURCHASE_FORM_PROPS.AMOUNT]: new FormControl<number | undefined>(undefined),
    [PURCHASE_FORM_PROPS.DATE]: new FormControl<moment.Moment | undefined>(undefined),
    [PURCHASE_FORM_PROPS.DESCRIPTION]: new FormControl(''),
    [PURCHASE_FORM_PROPS.DISTRIBUTION_MODE]: new FormControl<ObjectValues<typeof DISTRIBUTION_MODES>>(
      DISTRIBUTION_MODES.EQUALLY
    ),
    [PURCHASE_FORM_PROPS.DEBITS]: new FormArray<DebitFormGroup>([]),
    [PURCHASE_FORM_PROPS._RECEIPT_NAME]: new FormControl<string | undefined>(undefined),
  });
}

export type PurchaseFormGroup = ReturnType<typeof generateEmptyPurchaseFormGroup>;
