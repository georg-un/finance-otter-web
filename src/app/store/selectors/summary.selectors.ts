import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';

const selectSummary = (state: AppState) => state.summary;

export class SummarySelectors {

  static selectBalances = createSelector(selectSummary, state => state.balances);
  static selectCategorySummary = createSelector(selectSummary, state => state.categorySummary);
  static selectCategoryMonthSummary = createSelector(selectSummary, state => state.categoryMonthSummary);

}
