import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../core/rest-service/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { selectAllUsers } from '../store/selectors/user.selector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  users: User[];
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(selectAllUsers)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((users: User[]) => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}
