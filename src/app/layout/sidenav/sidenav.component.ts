import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { User } from '../../core/rest-service/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { selectCurrentUser } from '../../store/selectors/user.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isSidenavOpen } from '../../store/selectors/layout.selectors';
import { LayoutActions } from '../../store/actions/layout.actions';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  private currentUser$: Observable<User>;
  private sidenavOpen: boolean;
  private onDestroy$: Subject<boolean> = new Subject();
  avatar = 'assets/otter-avatar.jpg';

  @ViewChild('sidenav', {static: true}) public sidenav: MatSidenav;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.store.select(isSidenavOpen)
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

}
