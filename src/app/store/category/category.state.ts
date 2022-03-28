import { Action, createSelector, State, StateContext, StateToken } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinOBackendService } from '../../core/fino-backend.service';
import { setEntityState } from '../utils/store.utils';
import { map } from 'rxjs/operators';
import { CategoryStateModel, DEFAULT_CATEGORY_STATE } from './category-state.model';
import { Category } from '../../core/entity/category';
import * as CategoryActions from './category.actions';

export const CATEGORY_STATE_TOKEN = new StateToken<CategoryStateModel>('CATEGORY');

@State<CategoryStateModel>({
  name: CATEGORY_STATE_TOKEN,
  defaults: DEFAULT_CATEGORY_STATE
})
@Injectable({
  providedIn: 'root'
})
export class CategoryState {

  public static selectAllCategories(): (state: CategoryStateModel) => Category[] {
    return createSelector([CategoryState], (state) => Object.values(state.entities));
  }

  constructor(
    private finoBackendService: FinOBackendService
  ) {
  }

  @Action(CategoryActions.FetchCategories)
  public _fetchCategories(ctx: StateContext<CategoryStateModel>): Observable<CategoryStateModel> {
    return this.finoBackendService.fetchCategories().pipe(
      map(categories => setEntityState(ctx, categories, 'id', this.sortCategories))
    );
  }

  private sortCategories(a: Category, b: Category): number {
    return a.label.localeCompare(b.label);
  }
}
