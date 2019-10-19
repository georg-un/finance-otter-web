import { AppState } from "../states/app.state";
import { createSelector } from "@ngrx/store";

const selectLayout = (state: AppState) => state.layout;

export const selectFAB = createSelector(
  selectLayout,
  state => state.fab
);
