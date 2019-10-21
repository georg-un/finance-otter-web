import { AppState } from "../states/app.state";
import { createSelector } from "@ngrx/store";

const selectLayout = (state: AppState) => state.layout;

export const selectFAB = createSelector(
  selectLayout,
  state => state.fab
);

export const selectFABLink = createSelector(
  selectLayout,
  state => state.fabLink
);

export const selectLeftHeaderButton = createSelector(
  selectLayout,
  state => state.leftHeaderButton
);

export const selectRightHeaderButton = createSelector(
  selectLayout,
  state => state.rightHeaderButton
);
