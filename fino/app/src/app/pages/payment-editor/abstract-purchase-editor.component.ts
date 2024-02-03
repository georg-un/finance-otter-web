import { Component, OnInit, Provider } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  AbstractControl,
  FormArray,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import BigNumber from 'bignumber.js';
import { UserService } from '../../services/user.service';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import {
  DEBIT_FORM_PROPS,
  DebitFormGroup,
  userToDebitFormGroup
} from './form-groups/debit-form-group';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { PurchaseService } from '../../services/purchase.service';
import { Destroyable } from '../../components/destroyable';
import { DebitSumPipe } from '../../utils/debit-sum.pipe';
import {
  DISTRIBUTION_MODES,
  generateEmptyPurchaseFormGroup,
  PURCHASE_FORM_PROPS, PurchaseFormGroup
} from './form-groups/purchase-form-group';
import { WithUid } from '../../utils/with-uid';
import { CategoryDTO, DebitDTO, PurchaseDTO, UserDTO } from '../../../../../domain';

BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: BigNumber.ROUND_DOWN });  // TODO: keep somewhere global

export const PURCHASE_EDITOR_IMPORTS = [
  CommonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatButtonModule,
  MatSlideToggleModule,
  ReactiveFormsModule,
  CommonModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  ReactiveFormsModule
]

export const PURCHASE_EDITOR_PROVIDERS: Provider[] = [
  DebitSumPipe,
  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
]

@Component({
  selector: 'DO-NOT-USE-abstract-purchase-editor',
  templateUrl: './purchase-editor.component.html',
  styleUrls: ['./purchase-editor.component.scss'],
  standalone: true,
  imports: [
    ...PURCHASE_EDITOR_IMPORTS,
  ],
  providers: [
    ...PURCHASE_EDITOR_PROVIDERS
  ]
})
export abstract class AbstractPurchaseEditorComponent extends Destroyable implements OnInit {

  readonly DISTRIBUTION_MODES = DISTRIBUTION_MODES

  readonly FORM_PROPS = PURCHASE_FORM_PROPS

  readonly DEBIT_FORM_PROPS = DEBIT_FORM_PROPS;

  readonly form = generateEmptyPurchaseFormGroup();

  users$: Observable<WithUid<UserDTO>[]> = this.userService.users$.pipe(
    filter((users) => !!users?.length)
  );

  categories$: Observable<WithUid<CategoryDTO>[]> = this.categoryService.activeCategories$.pipe(
    filter((categories) => !!categories?.length)
  );

  protected debitFormGroupInitialized = new BehaviorSubject(false);

  protected constructor(
    protected router: Router,
    protected authService: AuthService,
    protected userService: UserService,
    protected categoryService: CategoryService,
    protected purchaseService: PurchaseService,
  ) {
    super();
  }

  get debits(): FormArray<DebitFormGroup> {
    return this.form.get(this.FORM_PROPS.DEBITS) as FormArray;
  }

  ngOnInit() {
    this.users$.pipe(
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe((users) => {
      this.debits.clear();
      users.forEach((user) => {
        this.debits.push(userToDebitFormGroup(user, [this.validateTotalAmountMatchesDebitsSum(this.form)]));
      });
      this.debitFormGroupInitialized.next(true);
    });
  }

  abstract handleSubmit(): void;

  setDateToday(): void {
    this.form.get(this.FORM_PROPS.DATE)?.setValue(moment());
  }

  validateAllDebits(): void {
    this.debits.controls.forEach((debit) => {
      debit.get(this.DEBIT_FORM_PROPS.AMOUNT)?.updateValueAndValidity();
    });
    this.debits.controls.forEach((debit) => debit.markAllAsTouched());
  }

  validateTotalAmountMatchesDebitsSum(form: AbstractControl): ValidatorFn {
    return (): ValidationErrors | null => {
      const totalAmountControl = form.get(this.FORM_PROPS.AMOUNT);
      const debitsArray = form.get(this.FORM_PROPS.DEBITS) as FormArray<DebitFormGroup>;
      const enabledDebits = debitsArray?.controls
        .filter((debit) => debit.get(this.DEBIT_FORM_PROPS.ENABLED)?.value);

      const allEnabledDebitsSet = enabledDebits?.every((debit) => {
        return debit.get(this.DEBIT_FORM_PROPS.AMOUNT)?.value !== null;
      });

      if (totalAmountControl && enabledDebits?.length && allEnabledDebitsSet) {
        const totalAmount = totalAmountControl.value;
        const debitAmounts = enabledDebits
          .map((debit) => debit.get(this.DEBIT_FORM_PROPS.AMOUNT)?.value || 0)
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

  protected distributeToFields(relevantFields: DebitFormGroup[]): void {
    const totalAmount = this.form.get(this.FORM_PROPS.AMOUNT)!.value;
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

  protected getRest(totalAmount: BigNumber, amounts: BigNumber[]): BigNumber {
    return totalAmount.minus(
      amounts.reduce((a, b) => a.plus(b), new BigNumber(0))
    );
  }

  protected distributeByBresenham(rest: BigNumber, nFields: BigNumber): BigNumber[] {
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

  protected distributeDebitsIfDistributionModeEqual(): void {
    if (this.form.get(this.FORM_PROPS.DISTRIBUTION_MODE)?.value === this.DISTRIBUTION_MODES.EQUALLY) {
      this.debits.controls.forEach((debit) => {
        debit.get(DEBIT_FORM_PROPS.ENABLED)?.setValue(true);
        debit.get(DEBIT_FORM_PROPS.AMOUNT)?.setValue(null);
      });
      this.distributeToAllFields();
    }
    this.validateAllDebits();
  }

  protected getPurchaseFromFormGroup(purchaseFormGroup: PurchaseFormGroup): PurchaseDTO {
    return {
      type: 'purchase',
      payerUid: this.authService.currentUser.value?.uid!,
      categoryUid: purchaseFormGroup.get(this.FORM_PROPS.CATEGORY)!.value!,
      date: purchaseFormGroup.get(this.FORM_PROPS.DATE)!.value!.valueOf(),
      shop: purchaseFormGroup.get(this.FORM_PROPS.SHOP)!.value!,
      description: purchaseFormGroup.get(this.FORM_PROPS.DESCRIPTION)?.value as string | undefined,
      debits: this.getDebitFromFormArray(purchaseFormGroup.get(this.FORM_PROPS.DEBITS) as FormArray<DebitFormGroup>)
    };
  }

  protected getDebitFromFormArray(debitsFormArray: FormArray<DebitFormGroup> | null | undefined): DebitDTO {
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
