import { createAction, props } from '@ngrx/store';

export const setFAB = createAction(
  '[Layout] Set FAB',
  props<{fab: string}>()
);

export const setFABLink = createAction(
  '[Layout] Set FAB Link',
  props<{fabLink: string}>()
);

export const setLeftHeaderButton = createAction(
  '[Layout] Set Left Header Button',
  props<{leftHeaderButton: string}>()
);

export const setRightHeaderButton = createAction(
  '[Layout] Set Right Header Button',
  props<{rightHeaderButton: string}>()
);

export const setHeaderButtons = createAction(
  '[Layout] Set Header Buttons',
  props<{leftHeaderButton: string, rightHeaderButton: string}>()
);
