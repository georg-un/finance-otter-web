import { OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Purchase } from '../core/entity/purchase';
import { UserSelectors } from '../store/selectors/user.selectors';
import { takeUntil } from 'rxjs/operators';
import { User } from '../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { PurchaseEditorService } from './purchase-editor.service';
import { DistributionFragment } from './distribution-fragment';
import { MatSnackBar } from '@angular/material';
import { MultilineSnackbarComponent } from '../shared/multiline-snackbar/multiline-snackbar.component';
import { BigNumber } from "bignumber.js";

export abstract class AbstractEditor implements OnInit, OnDestroy {

  purchase: Purchase;
  sumAmount: number;
  users$: Observable<User[]>;
  date: Date;
  distributionFragments: DistributionFragment[] = [];
  protected onDestroy$: Subject<boolean> = new Subject();

  protected constructor(protected store: Store<AppState>,
                        protected editorService: PurchaseEditorService,
                        protected snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.users$ = this.store.select(UserSelectors.selectAllUsers);

    this.editorService.addPurchaseTrigger
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.submitPurchase();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  abstract submitPurchase(): void;

  isPurchaseValid(): boolean {
    if (!this.purchase.buyerId) {
      this.snackBar.openFromComponent(MultilineSnackbarComponent, {data: 'User ID is missing.'});
      return false;
    } else if (!this.purchase.date) {
      this.snackBar.open('Please enter a date.');
      return false;
    } else if (!this.sumAmount) {
      this.snackBar.open('Please enter the amount.');
      return false;
    } else if (!new BigNumber(this.sumAmount).isEqualTo(
      this.distributionFragments
        .filter(fragment => fragment.checked)
        .map(fragment => new BigNumber(fragment.amount))
        .reduce((sum, current) => sum.plus(current), new BigNumber(0)))
      ) {
      this.snackBar.open('Total amount and debits don\'t match.');
      return false;
    } else {
      return true;
    }
  }

  resetDistributionFragments(): void {
    this.distributionFragments.forEach(fragment => {
      fragment.amount = null;
    });
  }

  distributeToAllFields(): void {
    this.distributeToFields(
      this.distributionFragments.filter(fragment => fragment.checked)
    );
  }

  distributeToEmptyFields(): void {
    this.distributeToFields(
      this.distributionFragments.filter(fragment => fragment.checked && !fragment.amount)
    );
  }

  private distributeToFields(relevantFields: DistributionFragment[]): void {
    // Get the remaining value
    const rest = this.getRest(
      new BigNumber(this.sumAmount),
      this.distributionFragments
        .filter(fragment => fragment.checked)
        .map(fragment => new BigNumber(fragment.amount || 0))
    );
    if (rest.isLessThan(0)) {
      console.error(`Sum of distribution fragments (${rest.toNumber()}) is larger than total amount (${this.sumAmount})`);
      this.snackBar.open("Sum of custom distribution is larger than amount.");
      return;
    }
    // Distribute the rest by the Bresenham Algorithm
    const assignedValues: BigNumber[] = this.distributeByBresenham(
      rest,
      new BigNumber(relevantFields.length)
    );
    // Assign the calculated values to the distribution-fragments
    relevantFields.forEach(field => {
      field.amount = assignedValues.pop().plus(field.amount || 0).toNumber();
    });
  }

  private getRest(totalAmount: BigNumber, amounts: BigNumber[]): BigNumber {
    return totalAmount.minus(
      amounts.reduce((a, b) => a.plus(b), new BigNumber(0))
    );
  }

  private distributeByBresenham(rest: BigNumber, nFields: BigNumber): BigNumber[] {
    let result: BigNumber[] = [];
    // Distribute the rest evenly
    const assignedValue = rest.dividedBy(nFields).decimalPlaces(2, BigNumber.ROUND_DOWN);
    for (let i = 0; i < nFields.toNumber(); i++) {
      result.push(assignedValue);
    }
    // Calculate the remained that could not be evenly distributed
    let remainder = rest.minus(assignedValue.times(nFields.toNumber()));
    // Distribute the rest to all fields cent by cent
    let resultIdx = 0;
    while (remainder.isGreaterThan(0)) {
      if (resultIdx >= result.length) {
        resultIdx = 0;  // reset index
      }
      result[resultIdx] = result[resultIdx].plus(0.01);
      remainder = remainder.minus(0.01);
      resultIdx += 1;
    }
    return result;
  }

}
