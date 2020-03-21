import { createAction, props } from '@ngrx/store';
import { ChartSeries } from "../../core/entity/chart-series";
import { ChartData } from "../../core/entity/chart-data";

export class SummaryActions {

  static requestBalances = createAction('[Summary] Request balances');
  static balancesReceived = createAction('[Summary] Balances received', props<{balances: object}>());

  static requestCategoryMonthSummary = createAction('[Summary] Request Category/Month Summary', props<{months: number}>());
  static categoryMonthSummaryReceived = createAction('[Summary] Category/Month Summary received', props<{summary: ChartSeries[]}>());

  static requestCategorySummary = createAction('[Summary] Request Category Summary', props<{months: number}>());
  static categorySummaryReceived = createAction('[Summary] Category Summary received', props<{summary: ChartData[]}>());

}
