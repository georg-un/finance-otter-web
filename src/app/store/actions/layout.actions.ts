import { createAction, props } from '@ngrx/store';

export class LayoutActions {

  static toggleSidenav = createAction('[Layout] Toggle Sidenav');

  static setPagination = createAction('[Layout] Set Pagination', props<{offset: number, limit: number}>());

}
