import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from '../../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UserSelectors } from '../../store/selectors/user.selectors';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { LayoutService } from '../layout.service';
import { Destroyable } from '../../shared/destroyable';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends Destroyable implements OnInit {

  currentUser$: Observable<User>;
  private sidenavOpen: boolean;

  @ViewChild('sidenav', {static: true}) public sidenav: MatSidenav;

  constructor(
    private layoutService: LayoutService,
    private store: Store<AppState>,
    private auth: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.currentUser$ = this.store.select(UserSelectors.selectCurrentUser).pipe(filter(user => !!user));
    this.layoutService.isSidenavOpen$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isOpen: boolean) => {
        this.sidenavOpen = isOpen;
        this.sidenav.toggle(isOpen);
      });
  }

  onOpenedChange($event: boolean) {
    if ($event !== this.sidenavOpen) {
      this.layoutService.toggleSidenav();
    }
  }

  logOut(): void {
    this.auth.logout({
      returnTo: environment.deployUrl
    });
  }
}
