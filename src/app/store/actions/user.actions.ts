import { createAction, props } from "@ngrx/store";
import { User } from "../../core/rest-service/entity/user";
import { Update } from "@ngrx/entity";

export const addUser = createAction('[User] Add User', props<{ user: User }>());
export const addUsers = createAction('[User] Add Users', props<{ users: User[] }>());
export const replaceUsers = createAction('[User] Replace Users', props<{ users: User[] }>());
export const updateUser = createAction('[User] Update User', props<{ user: Update<User> }>());
export const updateUsers = createAction('[User] Update Users', props<{ users: Update<User>[] }>());
export const clearUsers = createAction('[User] Clear Users');

export const requestUsers = createAction('[User] Request User Data');
export const usersReceived = createAction('[User] User Data Received', props<{users: User[]}>());
