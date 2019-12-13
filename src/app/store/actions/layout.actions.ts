import { createAction, props } from '@ngrx/store';

export class LayoutActions {
  static setFAB = createAction('[Layout] Set FAB',
    props<{fab: string}>());

  static setFABLink = createAction('[Layout] Set FAB Link',
    props<{fabLink: string}>());

  static setLeftHeaderButton = createAction('[Layout] Set Left Header Button',
    props<{leftHeaderButton: string}>());

  static setRightHeaderButton = createAction('[Layout] Set Right Header Button',
    props<{rightHeaderButton: string}>());

  static setHeaderButtons = createAction('[Layout] Set Header Buttons',
    props<{leftHeaderButton: string, rightHeaderButton: string}>());

  static toggleSidenav = createAction('[Layout] Toggle Sidenav');

  static setPagination = createAction('[Layout] Set Pagination', props<{offset: number, limit: number}>());

}
