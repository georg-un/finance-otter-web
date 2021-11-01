import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';

const selectLayout = (state: AppState) => state.layout;

export class LayoutSelectors {
  static isSidenavOpen = createSelector(selectLayout, state => state.sidenavOpen);
  static selectPagination = createSelector(selectLayout, state => state.pagination);
  static selectLeftHeaderConfig = createSelector(selectLayout,state => state.leftHeaderButton);
  static selectRightHeaderConfig = createSelector(selectLayout,state => state.rightHeaderButton);
  static showHeaderLogo =  createSelector(selectLayout,state => state.showHeaderLogo);
}
