import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutSelectors, RouterParams } from '../store/selectors/layout.selectors';
import { expandFromFAB, rotateOnChange } from './layout.animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [rotateOnChange, expandFromFAB]
})
export class LayoutComponent implements OnInit, OnDestroy {

  showFAB = true;
  protected fabIcon = 'add';
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>,
              private router: Router) {
  }

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
    this.store.select(LayoutSelectors.selectFabRoute)
      .pipe(take(1))
      .subscribe((fabRoute: RouterParams) => {
        this.router.navigate(fabRoute.commands, fabRoute.extras);
      });

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
