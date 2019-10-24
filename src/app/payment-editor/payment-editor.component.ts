import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../core/rest-service/entity/user';
import { MatSlideToggleChange } from '@angular/material';
import { AppState } from "../store/states/app.state";
import { Store } from "@ngrx/store";
import { selectCurrentUser, selectUsers } from "../store/selectors/core.selectors";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Payment } from "../core/rest-service/entity/payment";
import { IdGeneratorService } from "../core/id-generator.service";
import { Debit } from "../core/rest-service/entity/debit";
import { addNewPayment } from "../store/actions/core.actions";
import { EditorService } from "./editor.service";

@Component({
  selector: 'app-payment-editor',
  templateUrl: './payment-editor.component.html',
  styleUrls: ['./payment-editor.component.scss']
})
export class PaymentEditorComponent implements OnInit, OnDestroy {

  // TODO: Add animation to slide custom debit fields in and out
  // TODO: Add validation before upload

  payment: Payment = new Payment();
  customDistribution = false;
  onDestroy$: Subject<boolean> = new Subject();

  users: User[];
  distributionFragments: {user: User, amount: number, checked: boolean}[];

  constructor(private store: Store<AppState>,
              private editorService: EditorService,
              private idGeneratorService: IdGeneratorService) { }

  ngOnInit() {
    this.store.select(selectCurrentUser)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((currentUser: User) => {
        this.payment.userId = currentUser.userId;
      });

    this.store.select(selectUsers)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((users: User[]) => {
        this.users = users;
        this.distributionFragments = this.users.map((user: User) => {
          return {user: user, amount: null, checked: true}
        });
      });

    this.editorService.addPaymentTrigger
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.submitPayment();
      })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  submitPayment(): void {
    if (!this.isPaymentValid()) {
      return
    }
    this.generatePayment();
    this.store.dispatch(
      addNewPayment({
        payment: this.payment
      })
    );
  }

  generatePayment(): void {
    const transactionId = this.idGeneratorService.generateId();
    this.payment.paymentId = transactionId;
    this.payment.debits = [];
    this.distributionFragments.forEach(distributionFragment => {
      this.payment.debits.push(
        new Debit({
          transactionId: transactionId,
          debitId: this.idGeneratorService.generateId(),
          debtorId: distributionFragment.user.userId,
          amount: distributionFragment.amount
        })
      );
    });
  }

  isPaymentValid(): boolean {
    if (!this.payment.userId) {
      console.log('userId is missing');  // TODO: Display toast messages as well.
      return false;
    } else if (!this.payment.date) {
      console.log('date is missing');
      return false;
    } else if(!this.payment.sumAmount) {
      console.log('sumAmount is missing');
      return false;
    } else if (
      this.payment.sumAmount !==
      this.distributionFragments
        .map(fragment => fragment.amount)
        .reduce((sum, current) => sum + current)) {
      console.log('sumAmount and sum of debit amounts do not match');
      return false;
    } else {
      return true;
    }
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
      this.payment.sumAmount,
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
      this.payment.sumAmount,
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
