export interface LayoutState {
  sidenavOpen: boolean;
  pagination: {offset: number, limit: number};
}

export const initialState: LayoutState = {
  sidenavOpen: false,
  pagination: {offset: 0, limit: 15}
};
