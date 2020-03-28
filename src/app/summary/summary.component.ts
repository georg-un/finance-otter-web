import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserSelectors } from '../store/selectors/user.selectors';
import { SummaryActions } from "../store/actions/summary.actions";
import { SummarySelectors } from "../store/selectors/summary.selectors";
import { ChartData } from "../core/entity/chart-data";
import { ChartSeries } from "../core/entity/chart-series";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  balances$: Observable<object[]>;
  categorySummary$: Observable<ChartData[]>;
  categoryMonthSummary$: Observable<ChartSeries[]>;
  private onDestroy$: Subject<boolean> = new Subject();

  chartSize: any[];

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(SummaryActions.requestBalances());
    this.store.dispatch(SummaryActions.requestCategorySummary({months: 6}));
    this.store.dispatch(SummaryActions.requestCategoryMonthSummary({months: 6}));

    this.balances$ = this.store.select(SummarySelectors.selectBalances)
      .pipe(map(balances => balances ? Object.entries(balances) : undefined));

    this.categorySummary$ = this.store.select(SummarySelectors.selectCategorySummary);
    this.categoryMonthSummary$ = this.store.select(SummarySelectors.selectCategoryMonthSummary);

    const chartWidth = Math.min(window.innerWidth - 48, 500);
    const chartHeight = Math.floor(chartWidth * 0.75);
    this.chartSize = [chartWidth, chartHeight];
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  selectUserById(id: string): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

}
