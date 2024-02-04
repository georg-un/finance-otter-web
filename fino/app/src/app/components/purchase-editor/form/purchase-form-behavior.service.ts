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
    this.debits.addValidators([this.validateAtLeastOneDebitEnabled(this.form), this.validateTotalAmountMatchesDebitsSum(this.form, false)]);

    this.users$.pipe(
      take(1),
    ).subscribe((users) => {
      this.debits.clear();
      users.forEach((user) => {
        this.debits.push(userToDebitFormGroup(user, [this.validateTotalAmountMatchesDebitsSum(this.form, true)]));
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
      debit.markAllAsTouched();
    });
  }

  changeDebitInputDisabled(change: MatCheckboxChange, debit: DebitFormGroup): void {
    const amountControl = debit.get(DEBIT_FORM_PROPS.AMOUNT);
    const enabledControl = debit.get(DEBIT_FORM_PROPS.ENABLED);

    if (change.checked) {
      amountControl?.enable();
      enabledControl?.setValue(true);
    } else {
      amountControl?.disable();
      amountControl?.setValue(0);
      amountControl?.markAsUntouched();
      enabledControl?.setValue(false);
    }
  }

  resetDistributionFragments(): void {
    this.debits.controls.forEach((debit) => {
      const amountControl = debit.get(DEBIT_FORM_PROPS.AMOUNT);
      const enabledControl = debit.get(DEBIT_FORM_PROPS.ENABLED);

      amountControl?.enable();
      amountControl?.setValue(null);
      amountControl?.markAsUntouched();
      enabledControl?.setValue(true);
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

  /**
   * Make sure that at least one debit is enabled if we're in custom distribution mode.
   * @param form  Purchase form
   * @private
   */
  private validateAtLeastOneDebitEnabled(form: AbstractControl): ValidatorFn {
    return (): ValidationErrors | null => {
      const { totalAmountControl, enabledDebits, isCustomDistribution } = this.getValidatorControls(form);

      if (totalAmountControl && isCustomDistribution && enabledDebits?.length === 0) {
        return { noDebits: true };
      }

      return null;
    };
  }

  /**
   * Make sure the amount of all enabled debits matches the total amount.
   * @param form  Purchase form
   * @param perDebitEvaluation  If true, the validator will not return an error as long as not all enabled debits are set.
   *                            This is required for per-debit evaluation. However, if we want to check if the whole debit array is valid,
   *                            we need to take all enabled debits into account.
   * @private
   */
  private validateTotalAmountMatchesDebitsSum(form: AbstractControl, perDebitEvaluation: boolean): ValidatorFn {
    return (): ValidationErrors | null => {
      const { totalAmountControl, enabledDebits, isCustomDistribution } = this.getValidatorControls(form);

      const allEnabledDebitsSet = enabledDebits?.every((debit) => {
        return debit.get(DEBIT_FORM_PROPS.AMOUNT)?.value !== null;
      });

      if (totalAmountControl && isCustomDistribution && enabledDebits?.length && (!perDebitEvaluation || allEnabledDebitsSet)) {
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

  private getValidatorControls(form: AbstractControl) {
    const totalAmountControl = form.get(PURCHASE_FORM_PROPS.AMOUNT);
    const debitsArray = form.get(PURCHASE_FORM_PROPS.DEBITS) as FormArray<DebitFormGroup>;
    const enabledDebits = debitsArray?.controls
      .filter((debit) => debit.get(DEBIT_FORM_PROPS.ENABLED)?.value);
    const isCustomDistribution = form.get(PURCHASE_FORM_PROPS.DISTRIBUTION_MODE)?.value === DISTRIBUTION_MODES.CUSTOM;

    return { totalAmountControl, enabledDebits, isCustomDistribution };
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
