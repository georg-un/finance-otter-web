import { createAction, props } from '@ngrx/store';
import { Balances, CategoryByMonthSummary, CategorySummary } from '../../core/entity/summaries';

export class SummaryActions {

  static requestBalances = createAction('[Summary] Request balances');
  static balancesReceived = createAction('[Summary] Balances received', props<{balances: Balances}>());

  static requestCategoryMonthSummary = createAction('[Summary] Request Category/Month Summary', props<{months: number}>());
  static categoryMonthSummaryReceived = createAction('[Summary] Category/Month Summary received', props<{summary: CategoryByMonthSummary[]}>());

  static requestCategorySummary = createAction('[Summary] Request Category Summary', props<{months: number}>());
  static categorySummaryReceived = createAction('[Summary] Category Summary received', props<{summary: CategorySummary[]}>());

}
