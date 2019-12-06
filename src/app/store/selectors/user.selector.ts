import { userAdapter } from '../states/user.state';
import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = userAdapter.getSelectors();

export const selectUserIds = selectIds;
export const selectUserEntities = selectEntities;
export const selectAllUsers = selectAll;
export const selectUserCount = selectTotal;

const selectUsers = (state: AppState) => state.users;

export const selectCurrentUser = createSelector(
  selectUsers,
  users => users[users.currentUserId]
);
