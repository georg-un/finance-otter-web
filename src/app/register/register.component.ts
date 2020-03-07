import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { User } from '../core/entity/user';
import { UserActions } from '../store/actions/user.actions';
import { UserSelectors } from '../store/selectors/user.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute
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
    const user = new User();
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    this.store.dispatch(UserActions.registerCurrentUser({user: user}));
  }

}
