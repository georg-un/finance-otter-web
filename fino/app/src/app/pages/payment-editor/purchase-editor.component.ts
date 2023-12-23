import { Component, OnInit } from '@angular/core';
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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Debits, Purchase } from '../../model/purchase';
import { AuthService } from '../../services/auth.service';
import BigNumber from 'bignumber.js';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { take } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Category } from '../../model/category';
import { CategoryService } from '../../services/category.service';
import {
  DEBIT_FORM_PROPS,
  DebitFormGroup,
  userToDebitFormGroup
} from './debit-form-group';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { PurchaseService } from '../../services/purchase.service';
import { Destroyable } from '../../components/destroyable';

type ObjectValues<T> = T[keyof T];

BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: BigNumber.ROUND_DOWN });  // TODO: keep somewhere global

@Component({
  selector: 'app-purchase-editor',
  templateUrl: './purchase-editor.component.html',
  styleUrls: ['./purchase-editor.component.scss'],
  standalone: true,
  imports: [
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
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class PurchaseEditorComponent extends Destroyable implements OnInit {

  readonly DISTRIBUTION_MODES = {
    EQUALLY: 'equally',
    CUSTOM: 'custom'
  } as const;

  readonly FORM_PROPS = {
    SHOP: 'shop',
    CATEGORY: 'category',
    AMOUNT: 'amount',
    DATE: 'date',
    DESCRIPTION: 'description',
    DISTRIBUTION_MODE: 'distributionMode',
    DEBITS: 'debits',
  } as const;

  readonly DEBIT_FORM_PROPS = DEBIT_FORM_PROPS;

  readonly form = new FormGroup({
    [this.FORM_PROPS.SHOP]: new FormControl(''),
    [this.FORM_PROPS.CATEGORY]: new FormControl(''),
    [this.FORM_PROPS.AMOUNT]: new FormControl<number | undefined>(undefined),
    [this.FORM_PROPS.DATE]: new FormControl<moment.Moment | undefined>(undefined),
    [this.FORM_PROPS.DESCRIPTION]: new FormControl(''),
    [this.FORM_PROPS.DISTRIBUTION_MODE]: new FormControl<ObjectValues<typeof this.DISTRIBUTION_MODES>>(
      this.DISTRIBUTION_MODES.EQUALLY
    ),
    [this.FORM_PROPS.DEBITS]: new FormArray<DebitFormGroup>([]),
  });

  users?: User[];
  categories?: Category[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private categoryService: CategoryService,
    private purchaseService: PurchaseService,
  ) {
    super();
  }

  get debits(): FormArray<DebitFormGroup> {
    return this.form.get(this.FORM_PROPS.DEBITS) as FormArray;
  }

  ngOnInit() {
    this.userService.users$.pipe(
      filter((users) => !!users?.length),
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe((users) => {
      this.users = users;
      users.forEach((user) => {
        (this.form.get(this.FORM_PROPS.DEBITS) as FormArray)
          .push(userToDebitFormGroup(user, [this.validateTotalAmountMatchesDebitsSum(this.form)]));
      });
    });

    this.categoryService.activeCategories$.pipe(
      filter((categories) => !!categories?.length),
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe((categories) => {
      this.categories = categories;
    });
  }

  createPurchase(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    this.distributeDebitsIfDistributionModeEqual();
    const purchase = this.getPurchaseFromFormGroup(this.form);
    if (!purchase) {
      alert('Something went wrong. Please try again later.');
      return;
    }
    this.purchaseService.createPurchase(purchase).pipe(
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe((purchaseId) => {
      this.router.navigate(['/purchases', purchaseId]);
    });
  }

  setDateToday(): void {
    this.form.get(this.FORM_PROPS.DATE)?.setValue(moment());
  }

  cancel(): void {
    this.router.navigate(['/', 'purchases']);
  }

  validateAllDebits(): void {
    this.debits.controls.forEach((debit) => {
      debit.get(this.DEBIT_FORM_PROPS.AMOUNT)?.updateValueAndValidity();
    });
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

  private distributeToFields(relevantFields: ReturnType<typeof userToDebitFormGroup>[]): void {
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

  private distributeDebitsIfDistributionModeEqual(): void {
    if (this.form.get(this.FORM_PROPS.DISTRIBUTION_MODE)?.value === this.DISTRIBUTION_MODES.EQUALLY) {
      this.debits.controls.forEach((debit) => {
        debit.get(DEBIT_FORM_PROPS.ENABLED)?.setValue(true);
        debit.get(DEBIT_FORM_PROPS.AMOUNT)?.setValue(null);
      });
      this.distributeToAllFields();
    }
    this.validateAllDebits();
  }

  private getPurchaseFromFormGroup(purchaseFormGroup: typeof this.form): Purchase | void {
    return {
      buyerUid: this.authService.currentUser.value?.uid!,
      category: purchaseFormGroup.get(this.FORM_PROPS.CATEGORY)!.value!,
      date: purchaseFormGroup.get(this.FORM_PROPS.DATE)!.value!.valueOf(),
      shop: purchaseFormGroup.get(this.FORM_PROPS.SHOP)!.value!,
      description: purchaseFormGroup.get(this.FORM_PROPS.DESCRIPTION)?.value as string | undefined,
      debits: this.getDebitFromFormArray(purchaseFormGroup.get(this.FORM_PROPS.DEBITS) as FormArray<DebitFormGroup>)
    };
  }

  private getDebitFromFormArray(debitsFormArray: FormArray<DebitFormGroup> | null | undefined): Debits {
    const debits: Debits = {};
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
