import { Injectable } from "@angular/core";
import { createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import * as UserActions from "../actions/user.actions";
import { EMPTY } from "rxjs";

@Injectable
export class UserEffects {

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.requestUsers),
    mergeMap(() => this.restService.fetchUsers()
      .pipe(
        map(users => (UserActions.usersReceived({users}))),
        catchError(() => EMPTY)
      ))
    )
  );

}
