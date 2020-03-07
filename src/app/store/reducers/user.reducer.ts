import { Action, createReducer, on } from '@ngrx/store';
import { initialState, userAdapter, UserState } from '../states/user.state';
import { UserActions } from '../actions/user.actions';

const userReducer = createReducer(
  initialState,
  on(UserActions.addUserEntity, (state, { user }) => {
    return userAdapter.addOne(user, state);
  }),
  on(UserActions.addUserEntities, (state, { users }) => {
    return userAdapter.addMany(users, state);
  }),
  on(UserActions.updateUserEntity, (state, { user }) => {
    return userAdapter.updateOne(user, state);
  }),
  on(UserActions.updateUserEntities, (state, { users }) => {
    return userAdapter.updateMany(users, state);
  }),
  on(UserActions.replaceUserEntities, (state, { users }) => {
    return userAdapter.addAll(users, state);
  }),
  on(UserActions.removeUserEntities, state => {
    return userAdapter.removeAll(state);
  }),
  on(UserActions.usersReceived, (state, {users}) => {
    return userAdapter.upsertMany(users, state);
  }),
  on(UserActions.setActivationState, (state, {activated}) => {
    return {...state, currentUserActivated: activated};
  })
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}
