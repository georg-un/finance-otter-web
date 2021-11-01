import { Action, createReducer, on } from '@ngrx/store';
import { LayoutState, initialState } from '../states/layout.state';
import { LayoutActions } from '../actions/layout.actions';


const layoutReducer = createReducer(
  initialState,
  on(LayoutActions.toggleSidenav, state => (
    {...state, sidenavOpen: !state.sidenavOpen}
  )),
  on(LayoutActions.setPagination, (state, {offset, limit}) => (
    {...state, pagination: {offset: offset, limit: limit}}
  )),
  on(LayoutActions.setHeaderConfig, (state, headerConfig) => (
    {...state, leftHeaderButton: headerConfig.leftButton, rightHeaderButton: headerConfig.rightButton, showHeaderLogo: headerConfig.showLogo}
  ))
);

export function reducer(state: LayoutState | undefined, action: Action) {
  return layoutReducer(state, action);
}
