import { ChartSeries } from "../../core/entity/chart-series";
import { ChartData } from "../../core/entity/chart-data";

export interface SummaryState {
  balances: object;
  categorySummary: ChartData[],
  categoryMonthSummary: ChartSeries[],
  syncJobs: number
}

export const initialState: SummaryState = {
  balances: null,
  categorySummary: null,
  categoryMonthSummary: null,
  syncJobs: 0
};
