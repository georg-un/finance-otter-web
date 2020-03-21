import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserSelectors } from '../store/selectors/user.selectors';
import { SummaryActions } from "../store/actions/summary.actions";

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
    this.store.dispatch(SummaryActions.requestBalances());
    this.store.dispatch(SummaryActions.requestCategorySummary({months: 6}));
    this.store.dispatch(SummaryActions.requestCategoryMonthSummary({months: 6}));

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
