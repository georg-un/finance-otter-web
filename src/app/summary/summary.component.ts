import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { UserSelectors } from '../store/selectors/user.selectors';
import { SummaryActions } from "../store/actions/summary.actions";
import { SummarySelectors } from "../store/selectors/summary.selectors";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  balances$: Observable<object[]>;
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(SummaryActions.requestBalances());
    this.store.dispatch(SummaryActions.requestCategorySummary({months: 6}));
    this.store.dispatch(SummaryActions.requestCategoryMonthSummary({months: 6}));

    this.balances$ = this.store.select(SummarySelectors.selectBalances)
      .pipe(map(balances => balances ? Object.entries(balances) : undefined));

  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  selectUserById(id: string): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

}
