import { CategoryMonthSummary, CategorySummary } from '../../core/entity/summaries';

export interface SummaryState {
  balances: object;
  categorySummary: CategorySummary[],
  categoryMonthSummary: CategoryMonthSummary[],
  syncJobs: number
}

export const initialState: SummaryState = {
  balances: null,
  categorySummary: null,
  categoryMonthSummary: null,
  syncJobs: 0
};
