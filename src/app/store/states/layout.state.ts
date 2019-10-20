export interface LayoutState {
  fab: string,
  fabLink: string,
  leftHeaderButton: string,
  rightHeaderButton: string
}

export const initialState: LayoutState = {
  fab: 'add',
  fabLink: 'edit',
  leftHeaderButton: 'menu',
  rightHeaderButton: 'sync'
};
