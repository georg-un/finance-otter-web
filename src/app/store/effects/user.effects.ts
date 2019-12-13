import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { UserActions } from '../actions/user.actions';

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
