import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { WithUid } from '../../../utils/with-uid';
import { UserDTO } from '../../../../../../domain';

export function userToDebitFormGroup(user: WithUid<UserDTO>, validators?: ValidatorFn[]) {
  return new FormGroup({
    [DEBIT_FORM_PROPS.ENABLED]: new FormControl(true),
    [DEBIT_FORM_PROPS.USER]: new FormControl(user),
    [DEBIT_FORM_PROPS.AMOUNT]: new FormControl<number | null>(null, { validators }),
  });
}

export type DebitFormGroup = ReturnType<typeof userToDebitFormGroup>;

export const DEBIT_FORM_PROPS = {
  ENABLED: 'enabled',
  USER: 'user',
  AMOUNT: 'amount',
} as const;
