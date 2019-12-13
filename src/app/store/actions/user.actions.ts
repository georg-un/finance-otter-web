import { createAction, props } from '@ngrx/store';
import { User } from '../../core/rest-service/entity/user';
import { Update } from '@ngrx/entity';

export class UserActions {
  static addUser = createAction('[User] Add User', props<{ user: User }>());
  static addUsers = createAction('[User] Add Users', props<{ users: User[] }>());
  static replaceUsers = createAction('[User] Replace Users', props<{ users: User[] }>());
  static updateUser = createAction('[User] Update User', props<{ user: Update<User> }>());
  static updateUsers = createAction('[User] Update Users', props<{ users: Update<User>[] }>());
  static clearUsers = createAction('[User] Clear Users');

  static requestUsers = createAction('[User] Request User Data');
  static usersReceived = createAction('[User] User Data Received', props<{users: User[]}>());
}
