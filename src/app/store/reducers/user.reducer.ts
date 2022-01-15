import { Action, createReducer, on } from '@ngrx/store';
import { initialState, userAdapter, UserState } from '../states/user.state';
import { UserActions } from '../actions/user.actions';

const userReducer = createReducer(
  initialState,
  on(UserActions.usersReceived, (state, {users}) => {
    return userAdapter.upsertMany(users, state);
  }),
  on(UserActions.setActivationState, (state, {activated}) => {
    return {...state, currentUserActivated: activated};
  }),
  on(UserActions.setCurrentUser, (state, {userId}) => {
    return {...state, currentUserId: userId};
  })
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}
