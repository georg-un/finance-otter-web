import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { UserActions } from '../actions/user.actions';
import { FinOBackendService } from "../../core/fino-backend.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../core/entity/user";

@Injectable()
export class UserEffects {

  constructor(private actions$: Actions,
              private restService: FinOBackendService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
  }

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.requestUsers),
    mergeMap(() => this.restService.fetchUsers()
      .pipe(
        map(users => (UserActions.usersReceived({users}))),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      ))
    )
  );

  isUserActive$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.checkIfUserIsActive),
    mergeMap(() => this.restService.checkIfUserActive()
      .pipe(
        map(result => {
          if (result === false) {
            this.router.navigate(['./register'], {relativeTo: this.route});
          }
        }),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      ))
    ),
    {dispatch: false}
  );

  createNewUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.createNewUser),
    map(action => {
      this.restService.createNewUser(action.user)
        .pipe(take(1))
        .subscribe(result => {
          console.log(result);
        });
      }
    )),
    {dispatch: false}
  );

}
