import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { User } from '../../core/entity/user';
import { UserActions } from '../../store/actions/user.actions';
import { UserSelectors } from '../../store/selectors/user.selectors';
import { take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Destroyable } from '../../shared/destroyable';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends Destroyable implements OnInit {

  firstName: string;
  lastName: string;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
    super();
  }

  ngOnInit() {
    // Redirect back to root-URL if user is already activated
    this.store.select(UserSelectors.isCurrentUserActivated)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isActivated: boolean) => {
        if (isActivated) {
          this.router.navigate(['../'], {relativeTo: this.route});
        }
      });
  }

  createUser() {
    this.auth.userProfile$
      .pipe(take(1))
      .subscribe((profile) => {
        const user = new User();
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        user.avatarUrl = profile ? profile['picture'] : undefined;
        this.store.dispatch(UserActions.registerCurrentUser({user: user}));
      });
  }

}
