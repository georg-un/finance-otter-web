import { Action, createReducer, on } from "@ngrx/store";
import { LayoutState, initialState } from "../states/layout.state";
import * as LayoutActions from "../actions/layout.actions";


const layoutReducer = createReducer(
  initialState,
  on(LayoutActions.setFAB, (state, {fab}) => ({...state, fab: fab}))
);

export function reducer(state: LayoutState | undefined, action: Action) {
  return layoutReducer(state, action);
}
