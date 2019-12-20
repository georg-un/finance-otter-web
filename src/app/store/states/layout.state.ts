export interface LayoutState {
  fab: string;
  fabLink: string;
  leftHeaderButton: string;
  rightHeaderButton: string;
  sidenavOpen: boolean;
  pagination: {offset: number, limit: number};
}

export const initialState: LayoutState = {
  fab: 'add',
  fabLink: 'new',
  leftHeaderButton: 'menu',
  rightHeaderButton: 'sync',
  sidenavOpen: false,
  pagination: {offset: 0, limit: 15}
};
