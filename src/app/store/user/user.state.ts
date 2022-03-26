import { Action, createSelector, State, StateContext, StateToken } from '@ngxs/store';
import { DEFAULT_USER_STATE, UserStateModel } from './user-state.model';
import { Injectable, NgZone } from '@angular/core';
import { User } from '../../core/entity/user';
import * as UserActions from './user.actions';
import { Observable } from 'rxjs';
import { FinOBackendService } from '../../core/fino-backend.service';
import { getClonedState } from '../store.utils';
import { AuthService, User as Auth0User } from '@auth0/auth0-angular';
import { filter, map, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Dictionary } from '@ngrx/entity';

export const USER_STATE_TOKEN = new StateToken<UserStateModel>('USERS');

@State<UserStateModel>({
  name: USER_STATE_TOKEN,
  defaults: DEFAULT_USER_STATE
})
@Injectable({
  providedIn: 'root'
})
export class UserState {

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
      map(() => this.setIsCurrentUserActivated(ctx, true))
    );
  }

  @Action(UserActions.CheckIfCurrentUserIsActivated)
  public _checkIfCurrentUserIsActivated(ctx: StateContext<UserStateModel>): Observable<UserStateModel> {
    return this.finoBackendService.checkIfUserActive().pipe(
      take(1),
      map(isActivated => this.setIsCurrentUserActivated(ctx, isActivated))
    );
  }

  @Action(UserActions.FetchUsers)
  public _fetchUsers(ctx: StateContext<UserStateModel>): Observable<UserStateModel> {
    return this.finoBackendService.fetchUsers().pipe(
      map(users => users.sort(this.sortUsers)),
      map(users => {
        const newState = getClonedState(ctx);
        newState.entityIds = users.map(u => u.userId);
        newState.entities = users.reduce((acc: Dictionary<User>, cur: User) => ({...acc, [cur.userId]: cur}), {});
        return ctx.setState(newState);
      })
    );
  }

  @Action(UserActions.SetCurrentUserId)
  public _setCurrentUserId(
    ctx: StateContext<UserStateModel>,
    action: UserActions.SetCurrentUserId
  ): UserStateModel {
    const newState = getClonedState(ctx);
    newState.currentUserId = action.payload.userId;
    return ctx.setState(newState);
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

  private setIsCurrentUserActivated(ctx: StateContext<UserStateModel>, isActivated: boolean): UserStateModel {
    const newState = getClonedState(ctx);
    newState.currentUserActivated = isActivated;
    return ctx.setState(newState);
  }

  private sortUsers(a: User, b: User): number {
    return a.firstName.localeCompare(b.firstName);
  }
}
