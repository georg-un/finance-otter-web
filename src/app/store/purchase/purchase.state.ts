import { Action, createSelector, State, StateContext, StateToken } from '@ngxs/store';
import { Injectable, NgZone } from '@angular/core';
import * as PurchaseActions from './purchase.actions';
import { Observable } from 'rxjs';
import { FinOBackendService } from '../../core/fino-backend.service';
import { getClonedState, updateEntityState } from '../utils/store.utils';
import { catchError, map, tap } from 'rxjs/operators';
import { DEFAULT_PURCHASE_STATE, PurchaseStateModel } from './purchase-state.model';
import { Purchase, SyncStatusEnum } from '../../core/entity/purchase';
import { Router } from '@angular/router';

export const PURCHASE_STATE_TOKEN = new StateToken<PurchaseStateModel>('PURCHASE');

@State<PurchaseStateModel>({
  name: PURCHASE_STATE_TOKEN,
  defaults: DEFAULT_PURCHASE_STATE
})
@Injectable({
  providedIn: 'root'
})
export class PurchaseState {

  public static selectAllPurchases(): (state: PurchaseStateModel) => Purchase[] {
    return createSelector([PurchaseState], (state) => Object.values(state.entities));
  }

  public static selectPurchaseById(purchaseId: string): (state: PurchaseStateModel) => Purchase {
    return createSelector([PurchaseState], (state) => state.entities[purchaseId]);
  }

  constructor(
    private ngZone: NgZone,
    private router: Router,
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
      map(purchases => updateEntityState(ctx, purchases, 'purchaseId'))
    );
  }

  @Action(PurchaseActions.FetchSinglePurchase)
  public _fetchSinglePurchase(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.FetchSinglePurchase
  ): Observable<PurchaseStateModel> {
    return this.finoBackendService.fetchPurchase(action.payload.purchaseId).pipe(
      map(purchase => updateEntityState(ctx, [purchase], 'purchaseId'))
    );
  }

  @Action(PurchaseActions.AddNewPurchase)
  public _addNewPurchase(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.AddNewPurchase
  ): Observable<PurchaseStateModel> {
    const purchase = action.payload.purchase;
    this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Syncing);
    this.finoBackendService.uploadNewPurchase(purchase, action.payload.receipt).pipe(
      catchError(err => this.handlePurchaseSyncError(err, ctx, purchase)),
      tap(purchase => {
        this.ngZone.run(() => this.router.navigate(['purchase', purchase.purchaseId], {replaceUrl: true}));
      }),
      map(purchase => updateEntityState(ctx, [purchase], 'purchaseId')),
    );
  }

  @Action(PurchaseActions.UpdatePurchase)
  public _updatePurchase(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.UpdatePurchase
  ): Observable<PurchaseStateModel> {
    const purchase = action.payload.purchase;
    this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Syncing);
    this.finoBackendService.updatePurchase(purchase).pipe(
      catchError(err => this.handlePurchaseSyncError(err, ctx, purchase)),
      map(purchase => updateEntityState(ctx, [purchase], 'purchaseId'))
    );
  }

  @Action(PurchaseActions.DeletePurchase)
  public _deletePurchase(
    ctx: StateContext<PurchaseStateModel>,
    action: PurchaseActions.DeletePurchase
  ): Observable<PurchaseStateModel> {
    const purchase = ctx.getState().entities[action.payload.purchaseId];
    this.setPurchaseSyncStatus(ctx, purchase, SyncStatusEnum.Syncing);
    this.finoBackendService.updatePurchase(purchase).pipe(
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
      map(purchase => updateEntityState(ctx, [purchase], 'purchaseId'))
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


  // *************** UTILITIES *************** //

  private handlePurchaseSyncError(error: any, ctx: StateContext<PurchaseStateModel>, purchase: Purchase): void {
    purchase.syncStatus = SyncStatusEnum.Error;
    updateEntityState(ctx, [purchase], 'purchaseId');
    throw error;
  }

  private setPurchaseSyncStatus(ctx: StateContext<PurchaseStateModel>, purchase: Purchase, syncStatus: SyncStatusEnum): StateContext<PurchaseStateModel> {
    purchase.syncStatus = syncStatus;
    updateEntityState(ctx, [purchase], 'purchaseId');
  }
}
