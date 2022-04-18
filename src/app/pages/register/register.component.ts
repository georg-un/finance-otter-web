import { Component, OnInit } from '@angular/core';
import { User } from '../../core/entity/user';
import { take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Destroyable } from '../../shared/destroyable';
import { AuthService, User as Auth0User } from '@auth0/auth0-angular';
import { Store } from '@ngxs/store';
import { UserState, UserActions } from '@fino/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends Destroyable implements OnInit {

  firstName: string;
  lastName: string;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
    super();
  }

  ngOnInit() {
    // Redirect back to root-URL if user is already activated
    this.store.select(UserState.isCurrentUserActivated())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isActivated: boolean) => {
        if (isActivated) {
          this.router.navigate(['../'], {relativeTo: this.route});
        }
      });
  }

  createUser() {
    this.auth.user$
      .pipe(take(1))
      .subscribe((profile: Auth0User) => {
        const user = {
          firstName: this.firstName,
          lastName: this.lastName,
          avatarUrl: profile?.picture
        } as User;
        this.store.dispatch(new UserActions.RegisterUser({user: user}));
      });
  }

}
