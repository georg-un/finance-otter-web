import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidenavService } from './sidenav.service';
import { MatSidenav } from '@angular/material';
import { User } from '../../core/rest-service/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { selectCurrentUser } from '../../store/selectors/user.selector';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  private currentUser$: Observable<User>;
  private onDestroy$: Subject<boolean> = new Subject();
  avatar: string = 'assets/otter-avatar.jpg';

  @ViewChild('sidenav') public sidenav: MatSidenav;

  constructor(private sidenavService: SidenavService,
              private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.currentUser$ = this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.onDestroy$));
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}
