import { Action, createSelector, NgxsOnInit, State, StateContext, StateToken, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinOBackendService } from '../../core/fino-backend.service';
import { setEntityState } from '../utils/store.utils';
import { filter, map, take } from 'rxjs/operators';
import { CategoryStateModel, DEFAULT_CATEGORY_STATE } from './category-state.model';
import { Category } from '../../core/entity/category';
import * as CategoryActions from './category.actions';
import { AuthService } from '@auth0/auth0-angular';
import { UserState } from '../user/user.state';

export const CATEGORY_STATE_TOKEN = new StateToken<CategoryStateModel>('CATEGORY');

@State<CategoryStateModel>({
  name: CATEGORY_STATE_TOKEN,
  defaults: DEFAULT_CATEGORY_STATE
})
@Injectable({
  providedIn: 'root'
})
export class CategoryState implements NgxsOnInit {

  public static selectAllCategories(): (state: CategoryStateModel) => Category[] {
    return createSelector([CategoryState], (state) => Object.values(state.entities));
  }

  public static selectCategoryById(id: number): (state: CategoryStateModel) => Category {
    return createSelector([CategoryState], (state) => state.entities[id]);
  }

  constructor(
    private store: Store,
    private finoBackendService: FinOBackendService
  ) {
  }

  @Action(CategoryActions.FetchCategories)
  public _fetchCategories(ctx: StateContext<CategoryStateModel>): Observable<CategoryStateModel> {
    return this.finoBackendService.fetchCategories().pipe(
      map(categories => setEntityState(ctx, categories, 'id', this.sortCategories))
    );
  }

  public ngxsOnInit(ctx?: StateContext<CategoryStateModel>): void {
    this.store.select(UserState.isCurrentUserActivated).pipe(
      filter(Boolean),
      take(1)
    ).subscribe(() => {
      ctx.dispatch(CategoryActions.FetchCategories);
    });
  }

  private sortCategories(a: Category, b: Category): number {
    return a.label.localeCompare(b.label);
  }
}
