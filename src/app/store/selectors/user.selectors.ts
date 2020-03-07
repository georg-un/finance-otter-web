import { userAdapter } from '../states/user.state';
import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { Dictionary } from '@ngrx/entity';
import { User } from '../../core/entity/user';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = userAdapter.getSelectors();

const selectUsers = (state: AppState) => state.users;

export class UserSelectors {

  static selectUserIds = createSelector(selectUsers, selectIds);
  static selectUserEntities = createSelector(selectUsers, selectEntities);
  static selectAllUsers = createSelector(selectUsers, selectAll);
  static selectUserCount = createSelector(selectUsers, selectTotal);

  static selectCurrentUser = createSelector(selectUsers,
    users => users.entities[users.currentUserId]
  );

  static isCurrentUserActivated = createSelector(selectUsers,
    users => users.currentUserActivated
  );

  static selectUserById = () => {
    return createSelector(
      UserSelectors.selectUserEntities,
      (entities: Dictionary<User>, props: { id: string }) => {
        return entities[props.id];
      },
    );
  }

}
