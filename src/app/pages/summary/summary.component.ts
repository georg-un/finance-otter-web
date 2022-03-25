import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from '../../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { BehaviorSubject, combineLatest, Observable, Subscriber } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { UserSelectors } from '../../store/selectors/user.selectors';
import { SummaryActions } from '../../store/actions/summary.actions';
import { SummarySelectors } from '../../store/selectors/summary.selectors';
import { ChartData } from '../../core/entity/chart-data';
import { ChartSeries } from '../../core/entity/chart-series';
import { Category } from '../../core/entity/category';
import { CategorySelectors } from '../../store/selectors/category.selectors';
import { CategoryMonthSummary, CategorySummary } from '../../core/entity/summaries';
import { LayoutActions } from '../../store/actions/layout.actions';
import { HeaderButtonOptions, HeaderConfig } from '../../shared/domain/header-config';
import { LayoutService } from '../../layout/layout.service';
import { Destroyable } from '../../shared/destroyable';

const HEADER_CONFIG: HeaderConfig = { leftButton: HeaderButtonOptions.Menu, rightButton: null, showLogo: true };


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent extends Destroyable implements OnInit {

  private categories$: Observable<Category[]> = this.store.select(CategorySelectors.selectAllCategories).pipe(
    filter(this.isFilledArray)
  );

  private categorySummaries$: Observable<CategorySummary[]> = this.store.select(SummarySelectors.selectCategorySummary).pipe(
    map(cs => this.isFilledArray(cs) ? cs : [])
  );

  private categoryMonthSummaries$: Observable<CategoryMonthSummary[]> = this.store.select(SummarySelectors.selectCategoryMonthSummary).pipe(
    map(cms => this.isFilledArray(cms) ? cms : [])
  );

  public balances$: Observable<object[]> = this.store.select(SummarySelectors.selectBalances).pipe(
    map(balances => balances ? Object.entries(balances) : undefined)
  );

  public categorySummaryChartData$: Observable<ChartData[]> = combineLatest([
    this.categorySummaries$,
    this.categories$
  ]).pipe(
    map(([categorySummaries, categories]: [CategorySummary[], Category[]]) => {
      return this.toCategorySummaryChartData(categorySummaries, categories);
    })
  );

  public categoryMonthSummaryChartSeries$: Observable<ChartSeries[]> = combineLatest([
    this.categoryMonthSummaries$,
    this.categories$
  ]).pipe(
    map(([categoryMonthSummaries, categories]: [CategoryMonthSummary[], Category[]]) => {
      return this.toCategoryMonthSummaryChartSeries(categoryMonthSummaries, categories);
    }),
    map(cms => cms.sort(this.compareCategorySummaryMonths))
  );

  public categoryColorMap$: Observable<ChartData[]> = this.categories$.pipe(map(categories => this.toCategoryColorMap(categories)));

  public chartSize$: Observable<[number, number]> = new Observable((observer: Subscriber<[number, number]>) => {
    const chartWidth = Math.min(window.innerWidth - 48, 500);
    const chartHeight = Math.floor(chartWidth * 0.75);
    observer.next([chartWidth, chartHeight]);
    observer.complete();
  }).pipe(shareReplay(1))

  private _categorySummaryMonths: BehaviorSubject<number> = new BehaviorSubject<number>(6);
  public categorySummaryMonths$: Observable<number> = this._categorySummaryMonths.asObservable();

  constructor(
    private store: Store<AppState>,
    private layoutService: LayoutService
  ) {
    super();
    this.store.dispatch(LayoutActions.setHeaderConfig(HEADER_CONFIG))
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.store.dispatch(LayoutActions.toggleSidenav()));
    this.layoutService.registerRightHeaderButtonClickCallback(() => {});
  }

  public ngOnInit(): void {
    this.store.dispatch(SummaryActions.requestBalances());
    this.store.dispatch(SummaryActions.requestCategorySummary({months: this._categorySummaryMonths.value}));
    this.store.dispatch(SummaryActions.requestCategoryMonthSummary({months: 6}));
  }

  public selectUserById(id: string): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

  public onCategorySummaryMonthsChange($event: number) {
    if ($event) {
      this._categorySummaryMonths.next($event);
      this.store.dispatch(SummaryActions.requestCategorySummary({months: $event}));
    }
  }

  public areAllChartDataValuesZero(chartData: ChartData[]): boolean {
    return !chartData || chartData.length === 0 || chartData.every(data => data.value === 0);
  }

  public areAllChartSeriesValuesZero(chartSeries: ChartSeries[]): boolean {
    return !chartSeries || chartSeries.length === 0 || chartSeries.every(series => this.areAllChartDataValuesZero(series.series));
  }

  private compareCategorySummaryMonths(a: ChartSeries, b: ChartSeries): 0 | -1 | 1 {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }

  private toCategoryColorMap(categories: Category[]): ChartData[] {
    return categories.map(category => {
      return {
        name: category.label,
        value: category.color
      } as ChartData;
    })
  }

  private toCategorySummaryChartData(categorySummaries: CategorySummary[], categories: Category[]): ChartData[] {
    return categories.map(category => {
      const categorySummary = categorySummaries.find(summary => summary.categoryId === category.id);
      return {
        name: category.label,
        value: categorySummary ? categorySummary.value : 0
      } as ChartData;
    });
  }

  private toCategoryMonthSummaryChartSeries(categoryMonthSummaries: CategoryMonthSummary[], categories: Category[]): ChartSeries[] {
    return categoryMonthSummaries.map(categoryMonthSummary => {
      return {
        name: categoryMonthSummary.name,
        series: this.toCategorySummaryChartData(categoryMonthSummary.series, categories)
      } as ChartSeries;
    });
  }

  private isFilledArray(value: any): boolean {
    return !!value && Array.isArray(value) && value.length > 0;
  }
}
