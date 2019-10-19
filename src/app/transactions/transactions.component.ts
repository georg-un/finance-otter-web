import { Component, OnDestroy, OnInit } from '@angular/core';
import { MockRestService } from '../core/rest-service/mock-rest.service';
import { Transaction } from '../core/rest-service/entity/transaction';
import { AppState } from "../store/app.state";
import { Store } from "@ngrx/store";
import * as CoreActions from '../store/actions/core.actions';
import { selectTransactions } from "../store/selectors/core.selectors";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  transactions: Transaction[];
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private mockRestService: MockRestService,
              private store: Store<AppState>
  ) { }

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

}
