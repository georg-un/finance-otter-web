import { Action, createReducer, on } from '@ngrx/store';
import { initialState, categoryAdapter, CategoryState } from '../states/category.state';
import { CategoryActions } from '../actions/category.actions';

const categoryReducer = createReducer(
  initialState,
  on(CategoryActions.requestCategories, (state) => {
    return {...state, syncJobs: state.syncJobs + 1};
  }),
  on(CategoryActions.categoriesReceived, (state, {categories}) => {
    return categoryAdapter.upsertMany(categories, {...state, syncJobs: state.syncJobs - 1});
  })
);

export function reducer(state: CategoryState | undefined, action: Action) {
  return categoryReducer(state, action);
}
