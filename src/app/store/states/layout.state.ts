import { HeaderButtonConfig, HeaderButtonOptions } from 'src/app/shared/domain/header-config';


export interface LayoutState {
  sidenavOpen: boolean;
  pagination: {offset: number, limit: number};
  leftHeaderButton: HeaderButtonConfig;
  rightHeaderButton: HeaderButtonConfig;
  showHeaderLogo: boolean;
}

export const initialState: LayoutState = {
  sidenavOpen: false,
  pagination: {offset: 0, limit: 15},
  leftHeaderButton: HeaderButtonOptions.Menu,
  rightHeaderButton: HeaderButtonOptions.Add,
  showHeaderLogo: true
};
