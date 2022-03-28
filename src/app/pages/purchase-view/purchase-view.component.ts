import { Component, OnInit, ViewChild } from '@angular/core';
import { Purchase, SyncStatusEnum } from '../../core/entity/purchase';
import { Observable } from 'rxjs';
import { User } from '../../core/entity/user';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Debit } from '../../core/entity/debit';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../core/entity/category';
import { DynamicDialogButton, DynamicDialogData } from '../../shared/dynamic-dialog/dynamic-dialog-data.model';
import { DynamicDialogComponent } from '../../shared/dynamic-dialog/dynamic-dialog.component';
import { FinOBackendService } from '../../core/fino-backend.service';
import { FullscreenDialogService } from '../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { HeaderButtonOptions, HeaderConfig } from '../../shared/domain/header-config';
import { LayoutService } from '../../layout/layout.service';
import { Location } from '@angular/common';
import { Destroyable } from '../../shared/destroyable';
import { Store } from '@ngxs/store';
import { CategoryState, PurchaseActions, PurchaseState, UserState } from '@fino/store';

const HEADER_CONFIG: HeaderConfig = {leftButton: HeaderButtonOptions.Back, rightButton: HeaderButtonOptions.Edit, showLogo: false};

@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.scss']
})
export class PurchaseViewComponent extends Destroyable implements OnInit {

  // FIXME: Load entity data if not present.
  purchase: Purchase;
  user$: Observable<User>;
  category$: Observable<Category>;
  debitSum: number;

  @ViewChild('tooltip', {static: false}) tooltip: MatTooltip;

  private readonly syncIndicatorTooltipContent = {
    syncIndicatorRemote: 'Transaction is synced.',
    syncIndicatorSyncing: 'Syncing transaction...',
    syncIndicatorError: 'Synchronization error!'
  };

  private readonly deletePurchaseDialogData = <DynamicDialogData>{
    bodyHTML: `
    <h3>Delete purchase?</h3>
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
    private store: Store,
    private restService: FinOBackendService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private fullscreenDialog: FullscreenDialogService,
    private layoutService: LayoutService
  ) {
    super();
    this.layoutService.setHeaderConfig(HEADER_CONFIG);
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.location.back());
  }

  ngOnInit(): void {
    const purchaseId = this.route.snapshot.paramMap.get('purchaseId');
    this.store.select(PurchaseState.selectPurchaseById(purchaseId)).pipe(
      filter(Boolean),
      takeUntil(this.onDestroy$)
    ).subscribe((purchase: Purchase) => {
      if (purchase) {
        const editRoute = purchase.isCompensation ? 'edit-compensation' : 'edit-purchase';
        this.layoutService.registerRightHeaderButtonClickCallback(() => this.router.navigate([editRoute, this.purchase.purchaseId]));
        this.purchase = purchase;
        this.user$ = this.selectUserById(purchase.buyerId);
        this.category$ = this.store.select(CategoryState.selectCategoryById(purchase.categoryId));
        this.debitSum = purchase.debits
          .map((debit: Debit) => debit.amount)
          .reduce((sum, current) => sum + current);
      }
    });
  }

  selectUserById(id: string): Observable<User> {
    return this.store.select(UserState.selectUserById(id)).pipe(filter(u => !!u));
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
        this.store.dispatch(new PurchaseActions.DeletePurchase({purchaseId: this.purchase.purchaseId}));
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
        case SyncStatusEnum.Error:
          return this.syncIndicatorTooltipContent.syncIndicatorError;
        default:
          return null;
      }
    }
  }
}
