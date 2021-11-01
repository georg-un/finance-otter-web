import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../store/states/app.state';
import { Store } from '@ngrx/store';
import { map, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Purchase } from '../../core/entity/purchase';
import { PurchaseSelectors } from '../../store/selectors/purchase.selectors';
import { PurchaseActions } from '../../store/actions/purchase.actions';
import { HeaderButtonOptions, HeaderConfig } from '../../shared/domain/header-config';
import { LayoutActions } from '../../store/actions/layout.actions';
import { LayoutService } from '../../layout/layout.service';

const HEADER_CONFIG: HeaderConfig = { leftButton: HeaderButtonOptions.Menu, rightButton: HeaderButtonOptions.Add, showLogo: true };

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit, OnDestroy {

  purchases: Purchase[];
  isLoading$: Observable<boolean>;
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(
    private store: Store<AppState>,
    private layoutService: LayoutService,
    private router: Router
  ) {
    this.store.dispatch(LayoutActions.setHeaderConfig(HEADER_CONFIG))
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.store.dispatch(LayoutActions.toggleSidenav()));
    this.layoutService.registerRightHeaderButtonClickCallback(() => this.router.navigate(['scan-receipt'], {skipLocationChange: true}));
  }

  ngOnInit() {
    this.store.select(PurchaseSelectors.selectAllPurchases)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((purchases: Purchase[]) => {
        this.purchases = purchases;
      });
    this.isLoading$ = this.store.select(PurchaseSelectors.selectSyncJobs)
      .pipe(map((nJobs: number) => nJobs > 0));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onCardClick($event: string): void {
    this.router.navigateByUrl('/purchase/' + $event);
  }

  onScrolledDown() {
    this.store.select(PurchaseSelectors.selectPurchaseCount)
      .pipe(take(1))
      .subscribe((count: number) => {
        this.store.dispatch(PurchaseActions.requestPurchases({offset: count, limit: 10}));
    });
  }

}
