import {Action, createSelector, NgxsOnInit, State, StateContext, StateToken} from '@ngxs/store';
import { DEFAULT_USER_STATE, UserStateModel } from './user-state.model';
import { Injectable, NgZone } from '@angular/core';
import { User } from '../../core/entity/user';
import * as UserActions from './user.actions';
import { Observable } from 'rxjs';
import { FinOBackendService } from '../../core/fino-backend.service';
import { setEntityState, setSingleStateProperty } from '../utils/store.utils';
import { AuthService, User as Auth0User } from '@auth0/auth0-angular';
import { filter, map, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export const USER_STATE_TOKEN = new StateToken<UserStateModel>('USER');

@State<UserStateModel>({
  name: USER_STATE_TOKEN,
  defaults: DEFAULT_USER_STATE
})
@Injectable({
  providedIn: 'root'
})
export class UserState implements NgxsOnInit {

  public static isCurrentUserActivated(): (state: UserStateModel) => boolean {
    return createSelector([UserState], (state) => state.currentUserActivated);
  }

  public static selectAllUsers(): (state: UserStateModel) => User[] {
    return createSelector([UserState], (state) => Object.values(state.entities));
  }

  public static selectCurrentUser(): (state: UserStateModel) => User {
    return createSelector([UserState], (state) => state.entities[state.currentUserId]);
  }

  public static selectUserById(userId: string): (state: UserStateModel) => User {
    return createSelector([UserState], (state) => state.entities[userId]);
  }

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private finoBackendService: FinOBackendService
  ) {
  }

  @Action(UserActions.RegisterUser)
  public _registerUser(
    ctx: StateContext<UserStateModel>,
    action: UserActions.RegisterUser
  ): Observable<UserStateModel> {
    return this.finoBackendService.createNewUser(action.payload.user).pipe(
      tap(() => ctx.dispatch(new UserActions.FetchUsers())),
      tap(() => this.ngZone.run(() => this.router.navigate(['/']))),
      map(() => setSingleStateProperty(ctx, 'currentUserActivated', true))
    );
  }

  @Action(UserActions.CheckIfCurrentUserIsActivated)
  public _checkIfCurrentUserIsActivated(ctx: StateContext<UserStateModel>): Observable<UserStateModel> {
    return this.finoBackendService.checkIfUserActive().pipe(
      take(1),
      tap((isActivated) => {
        if (!isActivated) {
          this.ngZone.run(() => this.router.navigate(['/', 'register']));
        }
      }),
      map(isActivated => setSingleStateProperty(ctx, 'currentUserActivated', isActivated))
    );
  }

  @Action(UserActions.FetchUsers)
  public _fetchUsers(ctx: StateContext<UserStateModel>): Observable<UserStateModel> {
    return this.finoBackendService.fetchUsers().pipe(
      map(users => setEntityState(ctx, users, 'userId', this.sortUsers))
    );
  }

  @Action(UserActions.SetCurrentUserId)
  public _setCurrentUserId(
    ctx: StateContext<UserStateModel>,
    action: UserActions.SetCurrentUserId
  ): UserStateModel {
    return setSingleStateProperty(ctx, 'currentUserId', action.payload.userId);
  }

  public ngxsOnInit(ctx?: StateContext<UserStateModel>): void {
    this.authService.user$.pipe(
      filter(Boolean),
      take(1)
    ).subscribe((auth0User: Auth0User) => {
      ctx.dispatch([
        new UserActions.FetchUsers(),
        new UserActions.SetCurrentUserId({userId: auth0User.sub}),
        new UserActions.CheckIfCurrentUserIsActivated()
      ]);
    });
  }

  private sortUsers(a: User, b: User): number {
    return a.firstName.localeCompare(b.firstName);
  }
}
