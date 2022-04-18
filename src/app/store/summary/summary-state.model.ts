import { Balances, CategoryByMonthSummary, CategorySummary } from '../../core/entity/summaries';

export interface SummaryStateModel {
  balances: Balances;
  categorySummary: CategorySummary[];
  categoryByMonthSummary: CategoryByMonthSummary[];
}

export const DEFAULT_SUMMARY_STATE: SummaryStateModel = {
  balances: {},
  categorySummary: [],
  categoryByMonthSummary: []
};
