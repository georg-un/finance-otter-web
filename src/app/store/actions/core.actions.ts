import { createAction, props } from "@ngrx/store";
import { User } from "../../core/rest-service/entity/user";

export const requestUserData = createAction(
  '[Core] Request User Data'
);

export const userDataReceived = createAction(
  '[Core] User Data Received',
  props<{users: User[]}>()
);
