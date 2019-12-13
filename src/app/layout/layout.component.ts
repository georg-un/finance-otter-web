import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LayoutSelectors } from '../store/selectors/layout.selectors';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  protected showFAB = true;
  protected fabIcon = 'add';
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.store.select(LayoutSelectors.selectFAB)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((fab: string) => {
        if (fab && (fab === 'add' || fab === 'edit')) {
          this.showFAB = true;
          this.fabIcon = fab;
        } else {
          this.showFAB = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onFABClick(): void {
    this.store.select(LayoutSelectors.selectFABLink)
      .pipe(take(1))
      .subscribe((fabLink: string) => {
      this.router.navigateByUrl(fabLink);
    });

  }

}
