import { Component, OnDestroy, OnInit } from '@angular/core';
import { Transaction } from '../core/rest-service/entity/transaction';
import { AppState } from "../store/states/app.state";
import { Store } from "@ngrx/store";
import * as CoreActions from '../store/actions/core.actions';
import { selectTransactions } from "../store/selectors/core.selectors";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  transactions: Transaction[];
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.store.dispatch(CoreActions.requestTransactionData({offset: 0, limit: 0}));
    this.store.select(selectTransactions)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((transactions: Transaction[]) => {
        this.transactions = transactions;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onCardClick($event: number): void {
    this.router.navigateByUrl('/payment/' + $event);
  }

}
