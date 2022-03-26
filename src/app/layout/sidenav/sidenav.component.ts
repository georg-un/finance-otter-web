import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from '../../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { LayoutActions } from '../../store/actions/layout.actions';
import { UserSelectors } from '../../store/selectors/user.selectors';
import { LayoutSelectors } from '../../store/selectors/layout.selectors';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  currentUser$: Observable<User>;
  private sidenavOpen: boolean;
  private onDestroy$: Subject<boolean> = new Subject();

  @ViewChild('sidenav', {static: true}) public sidenav: MatSidenav;

  constructor(
    private store: Store<AppState>,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    this.currentUser$ = this.store.select(UserSelectors.selectCurrentUser).pipe(filter(user => !!user));
    this.store.select(LayoutSelectors.isSidenavOpen)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isOpen: boolean) => {
        this.sidenavOpen = isOpen;
        this.sidenav.toggle(isOpen);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onOpenedChange($event: boolean) {
    if ($event !== this.sidenavOpen) {
      this.store.dispatch(LayoutActions.toggleSidenav());
    }
  }

  logOut(): void {
    this.auth.logout({
      returnTo: environment.deployUrl
    });
  }
}
