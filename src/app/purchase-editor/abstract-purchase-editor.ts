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

export abstract class AbstractEditor implements OnInit, OnDestroy {

  // FIXME: 12.56€ does not work.

  purchase: Purchase;
  sumAmount: number;
  users$: Observable<User[]>;
  date: Date;
  distributionFragments: DistributionFragment[] = [];
  protected onDestroy$: Subject<boolean> = new Subject();

  protected constructor(protected store: Store<AppState>,
                        protected editorService: PurchaseEditorService) {}

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
      console.error('userId is missing');  // TODO: Display toast messages as well.
      return false;
    } else if (!this.purchase.date) {
      console.error('date is missing');
      return false;
    } else if (!this.sumAmount) {
      console.error('sumAmount is missing');
      return false;
    } else if (
      this.sumAmount !==
      this.distributionFragments
        .map(fragment => fragment.amount)
        .reduce((sum, current) => sum + current)) {
      console.error('sumAmount and sum of debit amounts do not match');
      return false;
    } else {
      return true;
    }
  }

  resetDebits(): void {
    this.distributionFragments.forEach(fragment => {
      fragment.amount = null;
    });
  }

  distributeToAllFields(): void {
    const rest = this.getRest(
      this.sumAmount,
      this.distributionFragments.map(fragment => fragment.amount)
    );
    const nCheckedFields = this.distributionFragments.filter(fragment => fragment.checked).length;

    const assignedValues = this.distributeByBresenham(rest, nCheckedFields);

    this.distributionFragments
      .filter(fragment => fragment.checked)
      .forEach(fragment => {
        fragment.amount = Math.round((fragment.amount + assignedValues.pop()) * 100) / 100;
      });
  }

  distributeToEmptyFields(): void {
    const rest = this.getRest(
      this.sumAmount,
      this.distributionFragments.map(fragment => fragment.amount)
    );
    const nCheckedAndEmptyFields = this.distributionFragments
      .filter(fragment => fragment.checked && !fragment.amount)
      .length;

    const assignedValues = this.distributeByBresenham(rest, nCheckedAndEmptyFields);

    this.distributionFragments
      .filter(fragment => fragment.checked && !fragment.amount)
      .forEach(fragment => {
        fragment.amount = Math.round((fragment.amount + assignedValues.pop()) * 100) / 100;
      });
  }

  private getRest(totalAmount: number, amounts: number[]): number {
    return totalAmount - amounts.reduce((a, b) => a + b, 0);
  }

  private distributeByBresenham(rest: number, nFields: number): number[] {
    let result: number[] = [];
    const assignedValue = Math.floor((rest / nFields) * 100 ) / 100;
    const remainder = Math.floor((rest * 100) % nFields) / 100;

    for (let i = 0; i < nFields; i++) {
      result.push(assignedValue);
    }

    let j = 0;
    for (let i = 0; i < remainder * 100; i++) {
      if (j >= nFields) {
        j = 0;
      }
      result[j] += 0.01;
      j += 1;
    }

    result = result.map(value => {
      return Math.round(value * 100) / 100;
    });

    return result;
  }

}
