import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { FinOBackendService } from '../../core/fino-backend.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { CategoryActions } from '../actions/category.actions';

@Injectable()
export class CategoryEffects {

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private restService: FinOBackendService
  ) {
  }

  fetchCategories$ = createEffect(() => this.actions$.pipe(
    ofType(CategoryActions.requestCategories),
    mergeMap(() => this.restService.fetchCategories()
      .pipe(
        map(categories => (CategoryActions.categoriesReceived({categories: categories}))),
        catchError(() => EMPTY)
      ))
    )
  );

}
