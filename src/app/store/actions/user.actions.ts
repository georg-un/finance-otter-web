import { createAction, props } from '@ngrx/store';
import { User } from '../../core/entity/user';

export class UserActions {
  static requestUsers = createAction('[User] Request Users');
  static usersReceived = createAction('[User] Users Received', props<{users: User[]}>());
  static checkIfUserIsActive = createAction('[User] Check if user is active');
  static registerCurrentUser = createAction('[User] Register current user', props<{user: User}>());
  static setActivationState = createAction('[User] Set activation state', props<{activated: boolean}>());
  static setCurrentUser = createAction('[User] Set current user', props<{userId: string}>());
}
