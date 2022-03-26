import { Dictionary } from '@ngrx/entity/src/models';
import { User } from '../../core/entity/user';

export interface UserStateModel {
  currentUserId: string;
  currentUserActivated: boolean;
  entities: Dictionary<User>;
  entityIds: string[];
}

export const DEFAULT_USER_STATE: UserStateModel = {
  currentUserId: undefined,
  currentUserActivated: false,
  entities: {},
  entityIds: []
};
