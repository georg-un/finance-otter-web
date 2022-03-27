import { Balances, CategoryByMonthSummary, CategorySummary } from '../../core/entity/summaries';

export interface SummaryState {
  balances: Balances;
  categorySummary: CategorySummary[],
  categoryMonthSummary: CategoryByMonthSummary[],
  syncJobs: number
}

export const initialState: SummaryState = {
  balances: null,
  categorySummary: null,
  categoryMonthSummary: null,
  syncJobs: 0
};
