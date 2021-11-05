import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Purchase, SyncStatusEnum } from '../../core/entity/purchase';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { Observable, Subject } from 'rxjs';
import { User } from '../../core/entity/user';
import { UserSelectors } from '../../store/selectors/user.selectors';
import { PurchaseSelectors } from '../../store/selectors/purchase.selectors';
import { filter, take, takeUntil } from 'rxjs/operators';
import { PurchaseActions } from '../../store/actions/purchase.actions';
import { Debit } from '../../core/entity/debit';
import { Router } from '@angular/router';
import { Category } from '../../core/entity/category';
import { CategorySelectors } from '../../store/selectors/category.selectors';
import { DynamicDialogButton, DynamicDialogData } from '../../shared/dynamic-dialog/dynamic-dialog-data.model';
import { DynamicDialogComponent } from '../../shared/dynamic-dialog/dynamic-dialog.component';
import { FinOBackendService } from '../../core/fino-backend.service';
import { FullscreenDialogService } from '../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { HeaderButtonOptions, HeaderConfig } from '../../shared/domain/header-config';
import { LayoutActions } from '../../store/actions/layout.actions';
import { LayoutService } from '../../layout/layout.service';
import { Location } from '@angular/common';

const HEADER_CONFIG: HeaderConfig = { leftButton: HeaderButtonOptions.Back, rightButton: HeaderButtonOptions.Edit, showLogo: false };

@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.scss']
})
export class PurchaseViewComponent implements OnInit, OnDestroy {

  // FIXME: Load entity data if not present.
  purchase: Purchase;
  user$: Observable<User>;
  category$: Observable<Category>;
  debitSum: number;
  private onDestroy$: Subject<boolean> = new Subject();

  @ViewChild('tooltip', {static: false}) tooltip: MatTooltip;

  private readonly syncIndicatorTooltipContent = {
    syncIndicatorRemote: 'Transaction is synced.',
    syncIndicatorSyncing: 'Syncing transaction...',
    syncIndicatorError: 'Synchronization error!'
  };

  private readonly deletePurchaseDialogData = <DynamicDialogData>{
    bodyHTML: `
    <h4>Delete purchase?</h4>
    Are you sure you want to delete this purchase?
    <br/><br/>
    This action cannot be undone.
    <br/><br/>
    `,
    buttons: [
      <DynamicDialogButton>{
        index: 0,
        label: 'Cancel',
        result: false
      },
      <DynamicDialogButton>{
        index: 1,
        label: 'Delete',
        color: 'warn',
        result: true
      }
    ]
  };

  constructor(
    private store: Store<AppState>,
    private restService: FinOBackendService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private fullscreenDialog: FullscreenDialogService,
    private layoutService: LayoutService
  ) {
    this.store.dispatch(LayoutActions.setHeaderConfig(HEADER_CONFIG));
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.location.back());
    this.layoutService.registerRightHeaderButtonClickCallback(() => this.router.navigate(['edit', this.purchase.purchaseId]));
  }

  ngOnInit(): void {
    this.store.select(PurchaseSelectors.selectCurrentPurchase)
      .pipe(
        filter(Boolean),
        takeUntil(this.onDestroy$)
      )
      .subscribe((purchase: Purchase) => {
        if (purchase) {
          this.purchase = purchase;
          this.user$ = this.selectUserById(purchase.buyerId);
          this.category$ = this.store.select(CategorySelectors.selectCategoryById(purchase.categoryId));
          this.debitSum = purchase.debits
            .map((debit: Debit) => debit.amount)
            .reduce((sum, current) => sum + current);
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  selectUserById(id: string): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id}).pipe(filter(u => !!u));
  }

  onBackButtonClick(): void {
    this.router.navigate(['list']);
  }

  onImageButtonClick(): void {
    const receipt: Observable<Blob> = this.restService.fetchReceipt(this.purchase.purchaseId)
      .pipe(take(1));
    this.fullscreenDialog.openReceiptViewDialog(receipt, true, this.purchase.purchaseId);
  }

  onDeleteButtonClick(): void {
    const dialogref = this.dialog.open(DynamicDialogComponent, {
      data: this.deletePurchaseDialogData
    });
    dialogref.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.store.dispatch(PurchaseActions.deletePurchase({purchase: this.purchase}));
      }
    });
  }

  onSyncIndicatorClick(): void {
    this.tooltip.show();
    setTimeout(() => {
      this.tooltip.hide(2500);
    }, 0);
  }

  getSyncIndicatorTooltipMessage(): string {
    if (this.purchase) {
      switch (this.purchase.syncStatus) {
        case SyncStatusEnum.Remote:
          return this.syncIndicatorTooltipContent.syncIndicatorRemote;
        case SyncStatusEnum.Syncing:
          return this.syncIndicatorTooltipContent.syncIndicatorSyncing;
        case SyncStatusEnum.Local:
        case SyncStatusEnum.LocalDelete:
        case SyncStatusEnum.LocalUpdate:
          return this.syncIndicatorTooltipContent.syncIndicatorError;
        default:
          return null;
      }
    }
  }

}
