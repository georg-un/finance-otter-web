export interface LayoutState {
  fab: string;
  fabLink: string;
  leftHeaderButton: string;
  rightHeaderButton: string;
  sidenavOpen: boolean;
}

export const initialState: LayoutState = {
  fab: 'add',
  fabLink: 'edit',
  leftHeaderButton: 'menu',
  rightHeaderButton: 'sync',
  sidenavOpen: false
};
