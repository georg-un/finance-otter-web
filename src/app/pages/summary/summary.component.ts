import { Component, OnInit } from '@angular/core';
import { User } from '../../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
import { DestroyableComponent } from '../../shared/destroyable.component';

const HEADER_CONFIG: HeaderConfig = { leftButton: HeaderButtonOptions.Menu, rightButton: null, showLogo: true };


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent extends DestroyableComponent implements OnInit {

  balances$: Observable<object[]>;
  categorySummaryChartData$: Observable<ChartData[]>;
  categoryMonthSummaryChartSeries$: Observable<ChartSeries[]>;
  categoryColorMap$: Observable<ChartData[]>;
  private categories$: Observable<Category[]>;
  private categorySummaries$: Observable<CategorySummary[]>;
  private categoryMonthSummaries$: Observable<CategoryMonthSummary[]>;

  chartSize: any[];
  categorySummaryMonths = 6;

  constructor(
    private store: Store<AppState>,
    private layoutService: LayoutService
  ) {
    super();
    this.store.dispatch(LayoutActions.setHeaderConfig(HEADER_CONFIG))
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.store.dispatch(LayoutActions.toggleSidenav()));
    this.layoutService.registerRightHeaderButtonClickCallback(() => {});
  }

  ngOnInit(): void {
    this.store.dispatch(SummaryActions.requestBalances());
    this.store.dispatch(SummaryActions.requestCategorySummary({months: this.categorySummaryMonths}));
    this.store.dispatch(SummaryActions.requestCategoryMonthSummary({months: 6}));

    this.categories$ = this.store.select(CategorySelectors.selectAllCategories).pipe(
      filter(this.isFilledArray)
    );
    this.categorySummaries$ = this.store.select(SummarySelectors.selectCategorySummary).pipe(
      map(cs => this.isFilledArray(cs) ? cs : [])
    );
    this.categoryMonthSummaries$ = this.store.select(SummarySelectors.selectCategoryMonthSummary).pipe(
      map(cms => this.isFilledArray(cms) ? cms : [])
    );

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
      }),
      map(cms => cms.sort(this.compareCategorySummaryMonths))
    );

    this.categoryColorMap$ = this.categories$.pipe(map(categories => this.toCategoryColorMap(categories)));

    const chartWidth = Math.min(window.innerWidth - 48, 500);
    const chartHeight = Math.floor(chartWidth * 0.75);
    this.chartSize = [chartWidth, chartHeight];
  }

  selectUserById(id: string): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

  onCategorySummaryMonthsChange($event: number) {
    if ($event) {
      this.categorySummaryMonths = $event;
      this.store.dispatch(SummaryActions.requestCategorySummary({months: this.categorySummaryMonths}));
    }
  }

  areAllChartDataValuesZero(chartData: ChartData[]): boolean {
    return !chartData || chartData.length === 0 || chartData.every(data => data.value === 0);
  }

  areAllChartSeriesValuesZero(chartSeries: ChartSeries[]): boolean {
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
