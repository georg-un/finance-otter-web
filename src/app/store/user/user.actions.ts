import { User } from '../../core/entity/user';

export class CheckIfCurrentUserIsActivated {
  public static readonly type = '[USER] Check if current user is activated';
}

export class FetchUsers {
  public static readonly type = '[USER] Fetch users';
}

export class RegisterUser {
  public static readonly type = '[USER] Register User';
  public static readonly payload: { user: User };
  constructor(public payload: typeof RegisterUser.payload) {}
}

export class SetCurrentUserId {
  public static readonly type = '[USER] Set current user ID';
  public static readonly payload: { userId: string };
  constructor(public payload: typeof SetCurrentUserId.payload) {}
}
