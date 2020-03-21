import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { FinOBackendService } from '../../core/fino-backend.service';
import { SummaryActions } from "../actions/summary.actions";

@Injectable()
export class SummaryEffects {

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private restService: FinOBackendService,
  ) {
  }

  requestBalances$ = createEffect(() => this.actions$.pipe(
    ofType(SummaryActions.requestBalances),
    mergeMap((action) => this.restService.fetchBalances()
      .pipe(
        map(balances => (SummaryActions.balancesReceived({balances: balances}))),
        catchError(() => EMPTY)
      ))
    )
  );

  requestCategorySummary$ = createEffect(() => this.actions$.pipe(
    ofType(SummaryActions.requestCategorySummary),
    mergeMap((action) => this.restService.fetchCategorySummary(action.months)
      .pipe(
        map(summary => (SummaryActions.categorySummaryReceived({summary: summary}))),
        catchError(() => EMPTY)
      ))
    )
  );

  requestCategoryMonthSummary$ = createEffect(() => this.actions$.pipe(
    ofType(SummaryActions.requestCategoryMonthSummary),
    mergeMap((action) => this.restService.fetchCategoryMonthSummary(action.months)
      .pipe(
        map(summary => (SummaryActions.categoryMonthSummaryReceived({summary: summary}))),
        catchError(() => EMPTY)
      ))
    )
  );

}
