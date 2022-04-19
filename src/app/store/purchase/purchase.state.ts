import { Action, createSelector, NgxsOnInit, State, StateContext, StateToken, Store } from '@ngxs/store';
import { Injectable, NgZone } from '@angular/core';
import * as PurchaseActions from './purchase.actions';
import { Observable } from 'rxjs';
import { FinOBackendService } from '../../core/fino-backend.service';
import { getClonedState, updateEntityState } from '../utils/store.utils';
import { catchError, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { DEFAULT_PURCHASE_STATE, PurchaseStateModel } from './purchase-state.model';
import { Purchase, SyncStatusEnum } from '../../core/entity/purchase';
import { Router } from '@angular/router';
import { UserState } from '../user/user.state';
import { Location } from '@angular/common';

export const PURCHASE_STATE_TOKEN = new StateToken<PurchaseStateModel>('PURCHASE');

@State<PurchaseStateModel>({
  name: PURCHASE_STATE_TOKEN,
  defaults: DEFAULT_PURCHASE_STATE
})
@Injectable({
  providedIn: 'root'
})
export class PurchaseState implements NgxsOnInit {

  public static selectAllPurchases(): (state: PurchaseStateModel) => Purchase[] {
    return createSelector([PurchaseState], (state) => Object.values(state.entities));
  }

  public static selectPurchaseById(purchaseId: string): (state: PurchaseStateModel) => Purchase {
    return createSelector([PurchaseState], (state) => state.entities[purchaseId]);
  }

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private location: Location,
    private store: Store,
    private finoBackendService: FinOBackendService
  ) {
  }

  // *************** PURCHASE ACTIONS *************** //

  @Action(PurchaseActions.FetchPurchases)
  public _fetchPurchases(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.FetchPurchases
  ): Observable<PurchaseStateModel> {
    return this.finoBackendService.fetchPurchases(action.payload.offset, action.payload.limit).pipe(
      map(purchases => updateEntityState(ctx, purchases, 'purchaseId', this.sortPurchasesByDate))
    );
  }

  @Action(PurchaseActions.FetchSinglePurchase)
  public _fetchSinglePurchase(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.FetchSinglePurchase
  ): Observable<PurchaseStateModel> {
    return this.finoBackendService.fetchPurchase(action.payload.purchaseId).pipe(
      map(purchase => updateEntityState(ctx, [purchase], 'purchaseId', this.sortPurchasesByDate))
    );
  }

  @Action(PurchaseActions.AddNewPurchase)
  public _addNewPurchase(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.AddNewPurchase
  ): Observable<PurchaseStateModel> {
    const purchase = action.payload.purchase;
    this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Syncing);
    return this.finoBackendService.uploadNewPurchase(purchase, action.payload.receipt).pipe(
      catchError(err => this.handlePurchaseSyncError(err, ctx, purchase)),
      tap(p => this.ngZone.run(() => this.router.navigate(['purchase', p.purchaseId], {replaceUrl: true}))),
      map(p => updateEntityState(ctx, [p], 'purchaseId', this.sortPurchasesByDate))
    );
  }

  @Action(PurchaseActions.UpdatePurchase)
  public _updatePurchase(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.UpdatePurchase
  ): Observable<PurchaseStateModel> {
    const purchase = action.payload.purchase;
    this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Syncing);
    return this.finoBackendService.updatePurchase(purchase).pipe(
      catchError(err => this.handlePurchaseSyncError(err, ctx, purchase)),
      map(p => updateEntityState(ctx, [p], 'purchaseId', this.sortPurchasesByDate)),
      tap(() => this.location.back())
    );
  }

  @Action(PurchaseActions.DeletePurchase)
  public _deletePurchase(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.DeletePurchase
  ): Observable<PurchaseStateModel> {
    const purchase = ctx.getState().entities[action.payload.purchaseId];
    this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Syncing);
    return this.finoBackendService.deletePurchase(purchase.purchaseId).pipe(
      catchError(err => this.handlePurchaseSyncError(err, ctx, purchase)),
      map(() => {
        const newState = getClonedState(ctx);
        delete newState.entities[action.payload.purchaseId];
        newState.entityIds = newState.entityIds.filter(id => id !== action.payload.purchaseId);
        return ctx.setState(newState);
      }),
      tap(() => this.ngZone.run(() => this.router.navigate(['/'])))
    );
  }


  // *************** RECEIPT ACTIONS *************** //

  @Action(PurchaseActions.UpdateReceipt)
  public _updateReceipt(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.UpdateReceipt
  ): Observable<PurchaseStateModel> {
    const purchase = ctx.getState().entities[action.payload.purchaseId];
    this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Syncing);
    return this.finoBackendService.updateReceipt(action.payload.purchaseId, action.payload.receipt).pipe(
      catchError(err => this.handlePurchaseSyncError(err, ctx, purchase)),
      map(() => this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Remote))
    );
  }

  @Action(PurchaseActions.DeleteReceipt)
  public _deleteReceipt(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.DeleteReceipt
  ): Observable<PurchaseStateModel> {
    const purchase = ctx.getState().entities[action.payload.purchaseId];
    this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Syncing);
    return this.finoBackendService.deleteReceipt(action.payload.purchaseId).pipe(
      catchError(err => this.handlePurchaseSyncError(err, ctx, purchase)),
      map(() => this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Remote))
    );
  }

  public ngxsOnInit(ctx?: StateContext<PurchaseStateModel>): void {
    this.store.select(UserState.isCurrentUserActivated()).pipe(
      distinctUntilChanged(),
      filter(Boolean)
    ).subscribe(() => {
      ctx.dispatch(new PurchaseActions.FetchPurchases({offset: 0, limit: 10}));
    });
  }


  // *************** UTILITIES *************** //

  private handlePurchaseSyncError(error: any, ctx: StateContext<PurchaseStateModel>, purchase: Purchase): never {
    purchase.syncStatus = SyncStatusEnum.Error;
    updateEntityState(ctx, [purchase], 'purchaseId');
    throw error;
  }

  private setPurchaseSyncStatus(ctx: StateContext<PurchaseStateModel>, purchase: Purchase, syncStatus: SyncStatusEnum): PurchaseStateModel {
    purchase.syncStatus = syncStatus;
    return updateEntityState(ctx, [purchase], 'purchaseId');
  }

  private sortPurchasesByDate(a: Purchase, b: Purchase): number {
    if (a.date > b.date) {
      return -1;
    } else if (a.date < b.date) {
      return 1;
    } else {
      return 0;
    }
  }
}
