import { Action, createReducer, on } from '@ngrx/store';
import { initialState, userAdapter, UserState } from '../states/user.state';
import { UserActions } from '../actions/user.actions';

const userReducer = createReducer(
  initialState,
  on(UserActions.addUser, (state, { user }) => {
    return userAdapter.addOne(user, state);
  }),
  on(UserActions.addUsers, (state, { users }) => {
    return userAdapter.addMany(users, state);
  }),
  on(UserActions.updateUser, (state, { user }) => {
    return userAdapter.updateOne(user, state);
  }),
  on(UserActions.updateUsers, (state, { users }) => {
    return userAdapter.updateMany(users, state);
  }),
  on(UserActions.replaceUsers, (state, { users }) => {
    return userAdapter.addAll(users, state);
  }),
  on(UserActions.clearUsers, state => {
    return userAdapter.removeAll(state);
  })
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}
