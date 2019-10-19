import { createAction, props } from "@ngrx/store";

export const setFAB = createAction(
  '[Layout] Set FA Button',
  props<{fab: string}>()
);
