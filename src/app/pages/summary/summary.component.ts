import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserSelectors } from '../../store/selectors/user.selectors';
import { SummaryActions } from '../../store/actions/summary.actions';
import { SummarySelectors } from '../../store/selectors/summary.selectors';
import { ChartData } from '../../core/entity/chart-data';
import { ChartSeries } from '../../core/entity/chart-series';
import { Category } from '../../core/entity/category';
import { CategorySelectors } from '../../store/selectors/category.selectors';
import { CategoryMonthSummary, CategorySummary } from '../../core/entity/summaries';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  balances$: Observable<object[]>;
  categorySummaryChartData$: Observable<ChartData[]>;
  categoryMonthSummaryChartSeries$: Observable<ChartSeries[]>;
  private categories$: Observable<Category[]>;
  private categorySummaries$: Observable<CategorySummary[]>;
  private categoryMonthSummaries$: Observable<CategoryMonthSummary[]>;
  private onDestroy$: Subject<boolean> = new Subject();

  chartSize: any[];

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(SummaryActions.requestBalances());
    this.store.dispatch(SummaryActions.requestCategorySummary({months: 12}));
    this.store.dispatch(SummaryActions.requestCategoryMonthSummary({months: 12}));

    this.categories$ = this.store.select(CategorySelectors.selectAllCategories)
      .pipe(filter(this.isFilledArray));
    this.categorySummaries$ = this.store.select(SummarySelectors.selectCategorySummary)
      .pipe(filter(this.isFilledArray));
    this.categoryMonthSummaries$ = this.store.select(SummarySelectors.selectCategoryMonthSummary)
      .pipe(filter(this.isFilledArray));

    this.balances$ = this.store.select(SummarySelectors.selectBalances)
      .pipe(map(balances => balances ? Object.entries(balances) : undefined));

    this.categorySummaryChartData$ = combineLatest([
      this.categorySummaries$,
      this.categories$
    ]).pipe(
      map(([categorySummaries, categories]: [CategorySummary[], Category[]]) => {
        return this.toCategorySummaryChartData(categorySummaries, categories);
      })
    );

    this.categoryMonthSummaryChartSeries$ = combineLatest([
      this.categoryMonthSummaries$,
      this.categories$
    ]).pipe(
      map(([categoryMonthSummaries, categories]: [CategoryMonthSummary[], Category[]]) => {
        return this.toCategoryMonthSummaryChartSeries(categoryMonthSummaries, categories);
      })
    );

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

  private toCategorySummaryChartData(categorySummaries: CategorySummary[], allCategories: Category[]): ChartData[] {
    return allCategories.map(category => {
      const categorySummary = categorySummaries.find(summary => summary.categoryId === category.id);
      return {
        name: category.label,
        value: categorySummary ? categorySummary.value : 0
      } as ChartData;
    });
  }

  private toCategoryMonthSummaryChartSeries(categoryMonthSummaries: CategoryMonthSummary[], allCategories: Category[]): ChartSeries[] {
    return categoryMonthSummaries.map(categoryMonthSummary => {
      return {
        name: categoryMonthSummary.name,
        series: this.toCategorySummaryChartData(categoryMonthSummary.series, allCategories)
      } as ChartSeries;
    });
  }

  private isFilledArray(value: any): boolean {
    return !!value && Array.isArray(value) && value.length > 0;
  }
}
