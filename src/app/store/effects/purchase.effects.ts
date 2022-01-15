import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Purchase, SyncStatusEnum } from '../../core/entity/purchase';
import { PurchaseActions } from '../actions/purchase.actions';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { FinOBackendService } from '../../core/fino-backend.service';
import { PurchaseSelectors } from '../selectors/purchase.selectors';

@Injectable()
export class PurchaseEffects {

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private restService: FinOBackendService,
              private router: Router,
              private location: Location
  ) {
  }

  loadPurchases$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.requestPurchases),
    mergeMap((action) => this.restService.fetchPurchases(action.offset, action.limit)
      .pipe(
        map(purchases => {
          purchases.forEach((purchase: Purchase) => purchase.syncStatus = SyncStatusEnum.Remote);
          return purchases;
        }),
        map(purchases => (PurchaseActions.purchasesReceived({purchases}))),
        catchError(() => EMPTY)
      ))
    )
  );

  loadSinglePurchase$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.requestSinglePurchase),
    mergeMap((action) => this.restService.fetchPurchase(action.purchaseId)
      .pipe(
        map(purchase => {
          purchase.syncStatus = SyncStatusEnum.Remote;
          return purchase;
        }),
        map(purchase => (PurchaseActions.singlePurchaseReceived({purchase}))),
        catchError(() => EMPTY)
      ))
    )
  );

  uploadPurchase$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.addNewPurchase),
    tap((action) => this.router.navigateByUrl('purchase/' + action.purchase.purchaseId, {replaceUrl: true})),
    switchMap((action) => new Observable<Action>((observer) => {
      // Update sync-status of purchase to 'syncing'
      const setSyncStatusAction = PurchaseActions.updatePurchaseEntity({
        purchase: {
          id: action.purchase.purchaseId,
          changes: {syncStatus: SyncStatusEnum.Syncing}
        }
      });
      observer.next(setSyncStatusAction);
      // Upload purchase & receipt and dispatch action according to upload result
      this.restService.uploadNewPurchase(action.purchase, action.receipt)
        .pipe(take(1))
        .subscribe(
          (result: Purchase) => observer.next(PurchaseActions.purchaseUploadSuccessful({purchase: result})),
          () => observer.next(PurchaseActions.purchaseUploadFailed({purchaseId: action.purchase.purchaseId}))
        );
    }))
  ));

  updatePurchase$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.updatePurchase),
    tap(() => this.location.back()),
    switchMap((action) => new Observable<Action>((observer) => {
      // Update sync-status of purchase to 'syncing'
      const setSyncStatusAction = PurchaseActions.updatePurchaseEntity({
        purchase: {
          id: action.purchase.purchaseId,
          changes: {syncStatus: SyncStatusEnum.Syncing}
        }
      });
      observer.next(setSyncStatusAction);
      // Upload purchase and dispatch action according to upload result
      this.restService.updatePurchase(action.purchase)
        .pipe(take(1))
        .subscribe(
          (result: Purchase) => observer.next(PurchaseActions.purchaseUpdateSuccessful({purchase: result})),
          () => observer.next(PurchaseActions.purchaseUpdateFailed({purchaseId: action.purchase.purchaseId}))
        );
    }))
  ));

  deletePurchase$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.deletePurchase),
    tap(() => this.router.navigateByUrl('/')),
    mergeMap((action) => this.restService.deletePurchase(action.purchase.purchaseId)
      .pipe(
        map(() => PurchaseActions.purchaseDeleteSuccessful({purchaseId: action.purchase.purchaseId})),
        catchError((err) => of(PurchaseActions.purchaseDeleteFailed({purchase: action.purchase})))
      )
    )
    )
  );

  updateOrDeleteReceipt$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.updateReceipt, PurchaseActions.deleteReceipt),
    mergeMap((action) => new Observable<Action>((observer) => {
      // Update sync-status of purchase to 'syncing'
      const setSyncStatusAction = PurchaseActions.updatePurchaseEntity({
        purchase: {
          id: action.purchaseId,
          changes: {syncStatus: SyncStatusEnum.Syncing}
        }
      });
      observer.next(setSyncStatusAction);
      // Update or delete receipt and dispatch action according to result
      if (action.type === PurchaseActions.deleteReceipt.type) {
        this.restService.deleteReceipt(action.purchaseId)
          .pipe(take(1))
          .subscribe(
            () => observer.next(PurchaseActions.receiptUpdateSuccessful({purchaseId: action.purchaseId})),
            () => observer.next(PurchaseActions.receiptUpdateFailed({purchaseId: action.purchaseId}))
          );
      } else {
        this.restService.updateReceipt(action.purchaseId, action.receipt)
          .pipe(take(1))
          .subscribe(
            () => observer.next(PurchaseActions.receiptUpdateSuccessful({purchaseId: action.purchaseId})),
            () => observer.next(PurchaseActions.receiptUpdateFailed({purchaseId: action.purchaseId}))
          );
      }
    }))
  ));

  purchaseUploadOrUpdateSuccessful$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.purchaseUploadSuccessful, PurchaseActions.purchaseUpdateSuccessful),
    map((action) => PurchaseActions.updatePurchaseEntity({
        purchase: {
          id: action.purchase.purchaseId,
          changes: {...action.purchase, syncStatus: SyncStatusEnum.Remote}
        }
      })
    ))
  );

  purchaseUploadFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.purchaseUploadFailed),
    map((action) => PurchaseActions.updatePurchaseEntity({
      purchase: {
        id: action.purchaseId,
        changes: {syncStatus: SyncStatusEnum.Local}
      }
    })))
  );

  purchaseUpdateFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.purchaseUpdateFailed),
    map((action) => PurchaseActions.updatePurchaseEntity({
      purchase: {
        id: action.purchaseId,
        changes: {syncStatus: SyncStatusEnum.LocalUpdate}
      }
    })))
  );

  purchaseDeleteFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.purchaseDeleteFailed),
    map((action) => PurchaseActions.addPurchaseEntity(
      {purchase: {...action.purchase, syncStatus: SyncStatusEnum.LocalDelete}}
    ))
    )
  );

  receiptUpdateResult$ = createEffect(() => this.actions$.pipe(
    ofType(PurchaseActions.receiptUpdateSuccessful, PurchaseActions.receiptUpdateFailed),
    switchMap((action) => {
      return this.store.select(PurchaseSelectors.selectPurchaseById(action.purchaseId)).pipe(
        take(1),
        map((purchase: Purchase) => {
          return PurchaseActions.updatePurchaseEntity({
            purchase: {
              id: action.purchaseId,
              changes: {
                ...purchase,
                syncStatus: action.type === PurchaseActions.receiptUpdateSuccessful.type ?
                  SyncStatusEnum.Remote :
                  SyncStatusEnum.Local
              }
            }
          });
        }));
    }))
  );

}
