import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';

const selectLayout = (state: AppState) => state.layout;

export class LayoutSelectors {

  static selectFAB = createSelector(selectLayout, state => state.fab);
  static selectFABLink = createSelector(selectLayout, state => state.fabLink);
  static selectLeftHeaderButton = createSelector(selectLayout, state => state.leftHeaderButton);
  static selectRightHeaderButton = createSelector(selectLayout, state => state.rightHeaderButton);
  static isSidenavOpen = createSelector(selectLayout, state => state.sidenavOpen);
  static selectPagination = createSelector(selectLayout, state => state.pagination);

}
