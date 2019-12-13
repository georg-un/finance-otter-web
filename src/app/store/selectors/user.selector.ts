import { userAdapter } from '../states/user.state';
import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = userAdapter.getSelectors();

const selectUsers = (state: AppState) => state.users;

export const selectUserIds = createSelector(selectUsers, selectIds);
export const selectUserEntities = createSelector(selectUsers, selectEntities);
export const selectAllUsers = createSelector(selectUsers, selectAll);
export const selectUserCount = createSelector(selectUsers, selectTotal);

export const selectCurrentUser = createSelector(
  selectUsers,
  users => users[users.currentUserId]
);
