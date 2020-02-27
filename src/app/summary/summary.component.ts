import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserSelectors } from '../store/selectors/user.selectors';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  users: User[];
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(UserSelectors.selectAllUsers)
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
