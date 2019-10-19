import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../core/rest-service/entity/user';
import { MatSlideToggleChange } from '@angular/material';
import { Transaction } from "../core/rest-service/entity/transaction";
import { AppState } from "../store/states/app.state";
import { Store } from "@ngrx/store";
import { selectCurrentUser, selectUsers } from "../store/selectors/core.selectors";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-payment-editor',
  templateUrl: './payment-editor.component.html',
  styleUrls: ['./payment-editor.component.scss']
})
export class PaymentEditorComponent implements OnInit, OnDestroy {

  // TODO: Add animation to slide custom debit fields in and out
  // TODO: Add validation before upload

  transaction: Transaction = new Transaction();
  customDistribution = false;
  onDestroy$: Subject<boolean> = new Subject();

  users: User[];
  distributionFragments: {user: User, amount: number, checked: boolean}[];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select(selectCurrentUser)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentUser: User) => {
        this.transaction.userId = currentUser.userId;
      });

    this.store.select(selectUsers)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((users: User[]) => {
        this.users = users;
        this.distributionFragments = this.users.map((user: User) => {
          return {user: user, amount: null, checked: true}
        });
      });


  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onDistributionToggleChange(change: MatSlideToggleChange): void {
    this.customDistribution = change.checked;
  }

  resetDebits(): void {
    this.distributionFragments.forEach(fragment => {
      fragment.amount = null;
    })
  }

  distributeToAllFields(): void {
    const rest = this.getRest(
      this.transaction.sumAmount,
      this.distributionFragments.map(fragment => { return fragment.amount })
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
      this.transaction.sumAmount,
      this.distributionFragments.map(fragment => { return fragment.amount })
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

    for (let i=0; i < nFields; i++) {
      result.push(assignedValue);
    }

    let j = 0;
    for (let i=0; i < remainder * 100; i++) {
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
