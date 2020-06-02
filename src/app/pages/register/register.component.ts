import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { User } from '../../core/entity/user';
import { UserActions } from '../../store/actions/user.actions';
import { UserSelectors } from '../../store/selectors/user.selectors';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  firstName: string;
  lastName: string;
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
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

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
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
