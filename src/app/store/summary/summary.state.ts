import { Action, createSelector, State, StateContext, StateToken } from '@ngxs/store';
import { Injectable } from '@angular/core';
import * as SummaryActions from './summary.actions';
import { Observable } from 'rxjs';
import { FinOBackendService } from '../../core/fino-backend.service';
import { setSingleStateProperty } from '../utils/store.utils';
import { map } from 'rxjs/operators';
import { DEFAULT_SUMMARY_STATE, SummaryStateModel } from './summary-state.model';
import { Balances, CategoryByMonthSummary, CategorySummary } from '../../core/entity/summaries';

export const SUMMARY_STATE_TOKEN = new StateToken<SummaryStateModel>('SUMMARY');

@State<SummaryStateModel>({
  name: SUMMARY_STATE_TOKEN,
  defaults: DEFAULT_SUMMARY_STATE
})
@Injectable({
  providedIn: 'root'
})
export class SummaryState {

  public static selectBalances(): (state: SummaryStateModel) => Balances {
    return createSelector([SummaryState], (state) => state.balances);
  }

  public static selectCategorySummary(): (state: SummaryStateModel) => CategorySummary[] {
    return createSelector([SummaryState], (state) => state.categorySummary);
  }

  public static selectCategoryByMonthSummary(): (state: SummaryStateModel) => CategoryByMonthSummary {
    return createSelector([SummaryState], (state) => state.categoryByMonthSummary);
  }

  constructor(
    private finoBackendService: FinOBackendService
  ) {
  }

  @Action(SummaryActions.FetchBalances)
  public _fetchBalances(ctx: StateContext<SummaryStateModel>): Observable<SummaryStateModel> {
    return this.finoBackendService.fetchBalances().pipe(
      map(balances => setSingleStateProperty(ctx, 'balances', balances))
    );
  }

  @Action(SummaryActions.FetchCategorySummary)
  public _fetchCategorySummary(
    ctx: StateContext<SummaryStateModel>,
    action: SummaryActions.FetchCategorySummary
  ): Observable<SummaryStateModel> {
    return this.finoBackendService.fetchCategorySummary(action.payload.months).pipe(
      map(categorySummary => setSingleStateProperty(ctx, 'categorySummary', categorySummary))
    );
  }

  @Action(SummaryActions.FetchCategoryByMonthSummary)
  public _fetchCategoryByMonthSummary(
    ctx: StateContext<SummaryStateModel>,
    action: SummaryActions.FetchCategoryByMonthSummary
  ): Observable<SummaryStateModel> {
    return this.finoBackendService.fetchCategoryByMonthSummary(action.payload.months).pipe(
      map(categoryByMonthSummary => setSingleStateProperty(ctx, 'categoryByMonthSummary', categoryByMonthSummary))
    );
  }
}
