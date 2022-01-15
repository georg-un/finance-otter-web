import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';
import { categoryAdapter } from '../states/category.state';

const {
  selectEntities,
  selectAll,
} = categoryAdapter.getSelectors();

const selectCategories = (state: AppState) => state.categories;

export class CategorySelectors {

  static selectCategoryEntities = createSelector(selectCategories, selectEntities);
  static selectAllCategories = createSelector(selectCategories, selectAll);
  static selectSyncJobs = createSelector(selectCategories, state => state.syncJobs);

  static selectCategoryById = (id: number) => createSelector(
    CategorySelectors.selectCategoryEntities,
    entities => entities[id]
  );

}
