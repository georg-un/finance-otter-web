import { createAction, props } from '@ngrx/store';
import { User } from '../../core/entity/user';
import { Update } from '@ngrx/entity';

export class UserActions {
  static addUserEntity = createAction('[User] Add User Entity', props<{ user: User }>());
  static addUserEntities = createAction('[User] Add User Entities', props<{ users: User[] }>());
  static replaceUserEntities = createAction('[User] Replace User Entities', props<{ users: User[] }>());
  static updateUserEntity = createAction('[User] Update User Entity', props<{ user: Update<User> }>());
  static updateUserEntities = createAction('[User] Update User Entities', props<{ users: Update<User>[] }>());
  static removeUserEntities = createAction('[User] Remove User Entities');

  static requestUsers = createAction('[User] Request Users');
  static usersReceived = createAction('[User] Users Received', props<{users: User[]}>());
  static checkIfUserIsActive = createAction('[User] Check if user is active');
}
