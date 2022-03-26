import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { UserActions } from '../actions/user.actions';
import { FinOBackendService } from '../../core/fino-backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User as Auth0User } from '@auth0/auth0-angular';

@Injectable()
export class UserEffects {

  constructor(private actions$: Actions,
              private restService: FinOBackendService,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
  }

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.requestUsers),
    mergeMap(() => this.restService.fetchUsers()
      .pipe(
        take(1),
        map(users => UserActions.usersReceived({users})),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      ))
    )
  );

  checkIfUserActive$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.checkIfUserIsActive),
    switchMap(() => {
      return this.restService.checkIfUserActive().pipe(
        take(1),
        map(isActive => {
          if (isActive === false) {
            this.router.navigate(['./register'], {relativeTo: this.route});
            return UserActions.setActivationState({activated: false});
          } else {
            return UserActions.setActivationState({activated: true});
          }
        }),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      );
    })
    )
  );

  registerCurrentUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.registerCurrentUser),
    mergeMap(action => this.restService.createNewUser(action.user).pipe(
      take(1),
      map(() => {
        this.router.navigate(['../'], {relativeTo: this.route});
        return UserActions.setActivationState({activated: true});
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
      )
    ))
  );

  setActivationState$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setActivationState),
    switchMap((action) => {
      if (action.activated) {
        return this.auth.user$.pipe(
          map((user: Auth0User) => UserActions.setCurrentUser({userId: user.sub}))
        );
      } else {
        return EMPTY;
      }
    })
  ));

}
