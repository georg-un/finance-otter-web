import { Action, createReducer, on } from "@ngrx/store";
import { User } from "../../core/rest-service/entity/user";
import * as CoreActions from '../actions/core.actions';

export interface CoreState {
  users: User[],
  userDataLoading: boolean
}

export const initialState: CoreState = {
  users: null,
  userDataLoading: false
};

const coreReducer = createReducer(
  initialState,
  on(CoreActions.requestUserData, state => ({...state, userDataLoading: true})),
  on(CoreActions.userDataReceived, (state, {users}) => ({...state, users: users, userDataLoading: false}))
);

export function reducer(state: CoreState | undefined, action: Action) {
  return coreReducer(state, action);
}
