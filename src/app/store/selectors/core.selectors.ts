import { AppState } from "../states/app.state";
import { createSelector } from "@ngrx/store";

export const selectCore = (state: AppState) => state.core;

export const selectPayment = createSelector(
  selectCore,
  state => state.payment
);

export const selectTransactions = createSelector(
  selectCore,
  state => state.transactions
);

export const selectUsers = createSelector(
  selectCore,
  state => state.users
);

export const selectCurrentUser = createSelector(
  selectCore,
  state => {
    if (state.users) {
      const filteredUsers = state.users.filter(user => user.userId === state.currentUserId);
      return filteredUsers.length === 1 ? filteredUsers[0] : null;
    }
  }
);
