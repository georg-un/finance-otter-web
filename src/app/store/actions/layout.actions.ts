import { createAction, props } from '@ngrx/store';
import { HeaderConfig } from '../../shared/domain/header-config';

export class LayoutActions {

  static toggleSidenav = createAction('[Layout] Toggle Sidenav');

  static setPagination = createAction('[Layout] Set Pagination', props<{offset: number, limit: number}>());

  static setHeaderConfig = createAction('[Layout] Set header config', props<HeaderConfig>());

}
