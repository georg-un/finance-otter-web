import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {User} from '../../core/entity/user';
import {BehaviorSubject, combineLatest, Observable, Subscriber} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {ChartData} from '../../core/entity/chart-data';
import {ChartSeries} from '../../core/entity/chart-series';
import {Category} from '../../core/entity/category';
import {CategoryByMonthSummary, CategorySummary} from '../../core/entity/summaries';
import {HeaderButtonOptions, HeaderConfig} from '../../shared/domain/header-config';
import {LayoutService} from '../../layout/layout.service';
import {Destroyable} from '../../shared/destroyable';
import {Select, Store} from '@ngxs/store';
import {CategoryState} from '@fino/store';
import {SummaryActions, SummaryState, UserState} from '@fino/store';

const HEADER_CONFIG: HeaderConfig = {leftButton: HeaderButtonOptions.Menu, rightButton: null, showLogo: true};


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent extends Destroyable implements OnInit {

  @Select(CategoryState.selectAllCategories())
  private categories$: Observable<Category[]>;

  public userMap$: Observable<Map<string, User>> = this.store.select(UserState.selectAllUsers()).pipe(
    map(users => users.reduce((acc, curr) => acc.set(curr.userId, curr), new Map<string, User>()))
  );

  private categorySummaries$: Observable<CategorySummary[]> = this.store.select(SummaryState.selectCategorySummary())
    .pipe(map(cs => this.isFilledArray(cs) ? cs : []));

  private categoryByMonthSummaries$: Observable<CategoryByMonthSummary[]> = this.store.select(SummaryState.selectCategoryByMonthSummary())
    .pipe(map(cms => this.isFilledArray(cms) ? cms : []));

  public balances$: Observable<[string, number][]> = this.store.select(SummaryState.selectBalances())
    .pipe(map(balances => balances ? Object.entries(balances) : undefined));

  public categorySummaryChartData$: Observable<ChartData[]> = combineLatest([
    this.categorySummaries$,
    this.categories$
  ]).pipe(
    map(([categorySummaries, categories]: [CategorySummary[], Category[]]) => {
      return this.toCategorySummaryChartData(categorySummaries, categories);
    })
  );

  public categoryByMonthSummaryChartSeries$: Observable<ChartSeries[]> = combineLatest([
    this.categoryByMonthSummaries$,
    this.categories$
  ]).pipe(
    map(([categoryByMonthSummaries, categories]: [CategoryByMonthSummary[], Category[]]) => {
      return this.toCategoryByMonthSummaryChartSeries(categoryByMonthSummaries, categories);
    }),
    map(cms => cms.sort(this.compareCategorySummaryMonths))
  );

  public categoryColorMap$: Observable<ChartData[]> = this.categories$.pipe(map(categories => this.toCategoryColorMap(categories)));

  public chartSize$: Observable<[number, number]> = new Observable((observer: Subscriber<[number, number]>) => {
    const chartWidth = Math.min(window.innerWidth - 48, 500);
    const chartHeight = Math.floor(chartWidth * 0.75);
    observer.next([chartWidth, chartHeight]);
    observer.complete();
  }).pipe(shareReplay(1));

  private _categorySummaryMonths: BehaviorSubject<number> = new BehaviorSubject<number>(6);
  public categorySummaryMonths$: Observable<number> = this._categorySummaryMonths.asObservable();

  constructor(
    private store: Store,
    private layoutService: LayoutService
  ) {
    super();
    this.layoutService.setHeaderConfig(HEADER_CONFIG);
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.layoutService.toggleSidenav());
    this.layoutService.registerRightHeaderButtonClickCallback(() => {
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(new SummaryActions.FetchBalances());
    this.store.dispatch(new SummaryActions.FetchCategorySummary({months: this._categorySummaryMonths.value}));
    this.store.dispatch(new SummaryActions.FetchCategoryByMonthSummary({months: 6}));
  }

  public onCategorySummaryMonthsChange($event: number) {
    if ($event) {
      this._categorySummaryMonths.next($event);
      this.store.dispatch(new SummaryActions.FetchCategorySummary({months: $event}));
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
    });
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

  private toCategoryByMonthSummaryChartSeries(categoryByMonthSummaries: CategoryByMonthSummary[], categories: Category[]): ChartSeries[] {
    return categoryByMonthSummaries.map(categoryByMonthSummary => {
      return {
        name: categoryByMonthSummary.name,
        series: this.toCategorySummaryChartData(categoryByMonthSummary.series, categories)
      } as ChartSeries;
    });
  }

  private isFilledArray(value: any): boolean {
    return !!value && Array.isArray(value) && value.length > 0;
  }
}
