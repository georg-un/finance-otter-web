import { User } from "../core/rest-service/entity/user";

export interface AppState {
  users: User[],
  currentUser: User
}
