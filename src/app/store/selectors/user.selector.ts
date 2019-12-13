import { userAdapter } from '../states/user.state';
import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { Dictionary } from '@ngrx/entity';
import { User } from '../../core/rest-service/entity/user';

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

export const selectUserById = () => {
  return createSelector(
    selectUserEntities,
    (entities: Dictionary<User>, props: { id: number }) => {
      return entities[props.id];
    },
  );
};
