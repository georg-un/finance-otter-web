import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject, Observable, shareReplay, take } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DISTRIBUTION_MODES, generateEmptyPurchaseFormGroup, PURCHASE_FORM_PROPS, PurchaseFormGroup } from './purchase-form-group';
import { DEBIT_FORM_PROPS, DebitFormGroup, userToDebitFormGroup } from './debit-form-group';
import { WithUid } from '../../../utils/with-uid';
import { CategoryDTO, DebitDTO, PurchaseDTO, UserDTO } from '../../../../../../domain';
import { UserService } from '../../../services/user.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment/moment';
import BigNumber from 'bignumber.js';

BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: BigNumber.ROUND_DOWN });

@Injectable()
export class PurchaseFormBehaviorService {

  private readonly userService = inject(UserService);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);

  private readonly _debitFormGroupInitialized = new BehaviorSubject(false);
  readonly debitFormGroupInitialized$ = this._debitFormGroupInitialized.asObservable().pipe(shareReplay(1));

  readonly users$: Observable<WithUid<UserDTO>[]> = this.userService.users$.pipe(
    filter((users) => !!users?.length)
  );

  readonly categories$: Observable<WithUid<CategoryDTO>[]> = this.categoryService.activeCategories$.pipe(
    filter((categories) => !!categories?.length)
  );

  readonly form = generateEmptyPurchaseFormGroup();

  get debits(): FormArray<DebitFormGroup> {
    return this.form.get(PURCHASE_FORM_PROPS.DEBITS) as FormArray;
  }

  constructor() {
    this.users$.pipe(
      take(1),
    ).subscribe((users) => {
      this.debits.clear();
      users.forEach((user) => {
        this.debits.push(userToDebitFormGroup(user, [this.validateTotalAmountMatchesDebitsSum(this.form)]));
      });
      this._debitFormGroupInitialized.next(true);
    });
  }

  setDateToday(): void {
    this.form.get(PURCHASE_FORM_PROPS.DATE)?.setValue(moment());
  }

  validateAllDebits(): void {
    this.debits.controls.forEach((debit) => {
      debit.get(DEBIT_FORM_PROPS.AMOUNT)?.updateValueAndValidity();
    });
    this.debits.controls.forEach((debit) => debit.markAllAsTouched());
  }

  validateTotalAmountMatchesDebitsSum(form: AbstractControl): ValidatorFn {
    return (): ValidationErrors | null => {
      const totalAmountControl = form.get(PURCHASE_FORM_PROPS.AMOUNT);
      const debitsArray = form.get(PURCHASE_FORM_PROPS.DEBITS) as FormArray<DebitFormGroup>;
      const enabledDebits = debitsArray?.controls
        .filter((debit) => debit.get(DEBIT_FORM_PROPS.ENABLED)?.value);

      const allEnabledDebitsSet = enabledDebits?.every((debit) => {
        return debit.get(DEBIT_FORM_PROPS.AMOUNT)?.value !== null;
      });

      if (totalAmountControl && enabledDebits?.length && allEnabledDebitsSet) {
        const totalAmount = totalAmountControl.value;
        const debitAmounts = enabledDebits
          .map((debit) => debit.get(DEBIT_FORM_PROPS.AMOUNT)?.value || 0)
          .reduce((acc, curr) => acc + curr, 0);

        if (totalAmount !== debitAmounts) {
          return { notEqual: true };
        }
      }

      return null;
    };
  }

  changeDebitInputDisabled(change: MatCheckboxChange, debit: DebitFormGroup): void {
    const control = debit.get(DEBIT_FORM_PROPS.AMOUNT);
    if (change.checked) {
      control?.enable();
    } else {
      control?.disable();
      control?.setValue(0);
      control?.markAsUntouched();
    }
  }

  resetDistributionFragments(): void {
    this.debits.controls.forEach((debit) => {
      const amountControl = debit.get(DEBIT_FORM_PROPS.AMOUNT);
      amountControl?.setValue(null);
      amountControl?.markAsUntouched();
    });
  }

  distributeToAllFields(): void {
    this.distributeToFields(
      this.debits.controls.filter((debit) => {
        return debit.get(DEBIT_FORM_PROPS.ENABLED)?.value;
      })
    );
    this.validateAllDebits();
  }

  distributeToEmptyFields(): void {
    this.distributeToFields(
      this.debits.controls.filter((debit) => {
        return debit.get(DEBIT_FORM_PROPS.ENABLED)?.value && !debit.get(DEBIT_FORM_PROPS.AMOUNT)?.value;
      })
    );
    this.validateAllDebits();
  }

  distributeDebitsIfDistributionModeEqual(): void {
    if (this.form.get(PURCHASE_FORM_PROPS.DISTRIBUTION_MODE)?.value === DISTRIBUTION_MODES.EQUALLY) {
      this.debits.controls.forEach((debit) => {
        debit.get(DEBIT_FORM_PROPS.ENABLED)?.setValue(true);
        debit.get(DEBIT_FORM_PROPS.AMOUNT)?.setValue(null);
      });
      this.distributeToAllFields();
    }
    this.validateAllDebits();
  }

  getPurchaseFromFormGroup(purchaseFormGroup: PurchaseFormGroup): PurchaseDTO {
    return {
      type: 'purchase',
      payerUid: this.authService.currentUser.value?.uid!,
      categoryUid: purchaseFormGroup.get(PURCHASE_FORM_PROPS.CATEGORY)!.value!,
      date: purchaseFormGroup.get(PURCHASE_FORM_PROPS.DATE)!.value!.valueOf(),
      shop: purchaseFormGroup.get(PURCHASE_FORM_PROPS.SHOP)!.value!,
      description: purchaseFormGroup.get(PURCHASE_FORM_PROPS.DESCRIPTION)?.value as string | undefined,
      debits: this.getDebitFromFormArray(purchaseFormGroup.get(PURCHASE_FORM_PROPS.DEBITS) as FormArray<DebitFormGroup>)
    };
  }

  private distributeToFields(relevantFields: DebitFormGroup[]): void {
    const totalAmount = this.form.get(PURCHASE_FORM_PROPS.AMOUNT)!.value;
    if (!totalAmount) {
      alert('Please set the total amount first.');
      return;
    }
    const sum = new BigNumber(totalAmount);
    // Get the remaining value
    const rest = this.getRest(
      sum,
      this.debits.controls
        .filter((debit) => debit.get(DEBIT_FORM_PROPS.ENABLED)!.value)
        .map((debit) => debit.get(DEBIT_FORM_PROPS.AMOUNT)!.value)
        .map((amount) => new BigNumber(amount || 0))
    );
    if ((!sum.isNegative() && rest.lessThan(0)) || (sum.isNegative() && rest.greaterThan(0))) {
      console.error(`A remainder (${rest.toNumber()}) was left over on when distributing the total amount (${totalAmount}).`);
      alert('Could not distribute the amount.');
      return;
    }
    // Distribute the rest by the Bresenham Algorithm
    const assignedValues: BigNumber[] = this.distributeByBresenham(
      rest,
      new BigNumber(relevantFields.length)
    );
    // Assign the calculated values to the debits
    relevantFields.forEach(field => {
      if (assignedValues.length) {
        const amountControl = field.get(DEBIT_FORM_PROPS.AMOUNT)!;
        const newValue = assignedValues.pop()!.plus(amountControl.value || 0).toNumber();
        amountControl.setValue(newValue);
      }
    });
  }

  private getRest(totalAmount: BigNumber, amounts: BigNumber[]): BigNumber {
    return totalAmount.minus(
      amounts.reduce((a, b) => a.plus(b), new BigNumber(0))
    );
  }

  private distributeByBresenham(rest: BigNumber, nFields: BigNumber): BigNumber[] {
    const result: BigNumber[] = [];
    // Distribute the rest evenly
    const assignedValue = rest.dividedBy(nFields);
    for (let i = 0; i < nFields.toNumber(); i++) {
      result.push(assignedValue);
    }
    // Calculate the remained that could not be evenly distributed
    let remainder = rest.minus(assignedValue.times(nFields.toNumber()));
    // Distribute the rest to all fields cent by cent
    let resultIdx = Math.floor(Math.random() * result.length);  // randomly pick a starting position
    while (remainder.greaterThan(0)) {
      if (resultIdx >= result.length) {
        resultIdx = 0;  // reset index
      }
      result[resultIdx] = result[resultIdx].plus(0.01);
      remainder = remainder.minus(0.01);
      resultIdx += 1;
    }
    return result;
  }

  private getDebitFromFormArray(debitsFormArray: FormArray<DebitFormGroup> | null | undefined): DebitDTO {
    const debits: DebitDTO = {};
    debitsFormArray?.controls.forEach((debitFormGroup) => {
      const enabled = debitFormGroup.get(DEBIT_FORM_PROPS.ENABLED)?.value;
      const debtorUid = debitFormGroup.get(DEBIT_FORM_PROPS.USER)?.value?.uid;
      const amount = debitFormGroup.get(DEBIT_FORM_PROPS.AMOUNT)?.value;
      if (!enabled || !debtorUid || amount === null || amount === undefined) {
        return;
      }
      debits[debtorUid] = amount;
    });

    return debits;
  }
}
