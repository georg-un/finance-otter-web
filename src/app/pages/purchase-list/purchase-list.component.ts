import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/states/app.state';
import { Store } from '@ngrx/store';
import { map, take, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Purchase } from '../../core/entity/purchase';
import { PurchaseSelectors } from '../../store/selectors/purchase.selectors';
import { PurchaseActions } from '../../store/actions/purchase.actions';
import { HeaderButtonOptions, HeaderConfig } from '../../shared/domain/header-config';
import { LayoutActions } from '../../store/actions/layout.actions';
import { LayoutService } from '../../layout/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPurchaseDialogComponent } from '../../shared/add-purchase-dialog/add-purchase-dialog.component';
import { DestroyableComponent } from '../../shared/destroyable.component';

const HEADER_CONFIG: HeaderConfig = {leftButton: HeaderButtonOptions.Menu, rightButton: HeaderButtonOptions.Add, showLogo: true};

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent extends DestroyableComponent implements OnInit {

  purchases: Purchase[];
  isLoading$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private layoutService: LayoutService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super();
    this.store.dispatch(LayoutActions.setHeaderConfig(HEADER_CONFIG));
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.store.dispatch(LayoutActions.toggleSidenav()));
    this.layoutService.registerRightHeaderButtonClickCallback(() => this.showAddPurchaseDialog());
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

  private showAddPurchaseDialog(): void {
    this.dialog.open(AddPurchaseDialogComponent);
  }
}
