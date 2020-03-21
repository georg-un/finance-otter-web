import { Action, createReducer, on } from '@ngrx/store';
import { initialState, SummaryState } from '../states/summary.state';
import { SummaryActions } from "../actions/summary.actions";


const summaryReducer = createReducer(
  initialState,
  on(SummaryActions.requestBalances, state => {
    return  {...state, syncJobs: state.syncJobs + 1};
  }),
  on(SummaryActions.balancesReceived, (state, {balances}) => {
    return  {...state, balances: balances, syncJobs: state.syncJobs - 1};
  }),
  on(SummaryActions.requestCategorySummary, state => {
    return  {...state, syncJobs: state.syncJobs + 1};
  }),
  on(SummaryActions.categorySummaryReceived, (state, {summary}) => {
    return  {...state, categorySummary: summary, syncJobs: state.syncJobs - 1};
  }),
  on(SummaryActions.requestCategoryMonthSummary, state => {
    return  {...state, syncJobs: state.syncJobs + 1};
  }),
  on(SummaryActions.categoryMonthSummaryReceived, (state, {summary}) => {
    return  {...state, categoryMonthSummary: summary, syncJobs: state.syncJobs - 1};
  }),
);


export function reducer(state: SummaryState | undefined, action: Action) {
  return summaryReducer(state, action);
}
