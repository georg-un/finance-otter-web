import { createAction, props } from "@ngrx/store";

export const setFAB = createAction(
  '[Layout] Set FAB',
  props<{fab: string}>()
);

export const setFABLink = createAction(
  '[Layout] Set FAB Link',
  props<{fabLink: string}>()
);
