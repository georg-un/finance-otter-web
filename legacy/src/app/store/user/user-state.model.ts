import { User } from '../../core/entity/user';
import { EntityStateModel } from '../utils/entity-state.model';

export interface UserStateModel extends EntityStateModel<User> {
  currentUserId: string;
  currentUserActivated: boolean;
}

export const DEFAULT_USER_STATE: UserStateModel = {
  currentUserId: undefined,
  currentUserActivated: false,
  entities: {},
  entityIds: []
};
