import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from '../../core/entity/user';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { LayoutService } from '../layout.service';
import { Destroyable } from '../../shared/destroyable';
import { Select } from '@ngxs/store';
import { UserState } from '@fino/store';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends Destroyable implements OnInit {

  @Select(UserState.selectCurrentUser)
  public currentUser$: Observable<User>;

  private sidenavOpen: boolean;

  @ViewChild('sidenav', {static: true}) public sidenav: MatSidenav;

  constructor(
    private layoutService: LayoutService,
    private auth: AuthService
  ) {
    super();
  }

  ngOnInit() {
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
