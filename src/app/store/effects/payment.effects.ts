import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { MockRestService } from '../../core/rest-service/mock-rest.service';
import { Router } from '@angular/router';
import { SyncStatusEnum } from '../../core/entity/payment';
import { PaymentActions } from '../actions/payment.actions';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { RouterSelectors } from '../selectors/router.selectors';
import { LayoutSelectors } from '../selectors/layout.selectors';

@Injectable()
export class PaymentEffects {

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private restService: MockRestService,
              private router: Router) {}

  loadPayments$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.requestPayments),
    mergeMap((action) => this.restService.fetchPayments(action.offset, action.limit)
      .pipe(
        map(payments => (PaymentActions.paymentsReceived({payments}))),
        catchError(() => EMPTY)
      ))
    )
  );

  loadSinglePayment$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.requestSinglePayment),
    mergeMap((action) => this.restService.fetchPayment(action.paymentId)
      .pipe(
        map(payment => (PaymentActions.singlePaymentReceived({payment}))),
        catchError(() => EMPTY)
      ))
    )
  );

  uploadPayment$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.addNewPayment),
    tap((action) => this.router.navigateByUrl('payment/' + action.payment.paymentId)),
    switchMap((action) => new Observable<Action>((observer) => {
      // Update sync-status of payment to 'syncing'
      const setSyncStatusAction = PaymentActions.updatePaymentEntity({
        payment: {
          id: action.payment.paymentId,
          changes: {syncStatus: SyncStatusEnum.Syncing}
        }
      });
      observer.next(setSyncStatusAction);
      // Upload payment and dispatch action according to upload result
      this.restService.uploadNewPayment(action.payment)
        .pipe(take(1))
        .subscribe((result) => {
          if (result.code !== 200) {
            console.log(result.code, result.message);  // TODO: Show this in a toast message
            observer.next(PaymentActions.paymentUploadFailed({paymentId: action.payment.paymentId}));
          } else {
            observer.next(PaymentActions.paymentUploadSuccessful({payment: result.payment}));
          }
        })
    }))
  ));

  updatePayment$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.updatePayment),
    tap((action) => this.router.navigateByUrl('payment/' + action.payment.paymentId)),
    switchMap((action) => new Observable<Action>((observer) => {
      // Update sync-status of payment to 'syncing'
      const setSyncStatusAction = PaymentActions.updatePaymentEntity({
        payment: {
          id: action.payment.paymentId,
          changes: {syncStatus: SyncStatusEnum.Syncing}
        }
      });
      observer.next(setSyncStatusAction);
      // Upload payment and dispatch action according to upload result
      this.restService.updatePayment(action.payment)
        .pipe(take(1))
        .subscribe((result) => {
          if (result.code !== 200) {
            console.log(result.code, result.message);  // TODO: Show this in a toast message
            observer.next(PaymentActions.paymentUpdateFailed({paymentId: action.payment.paymentId}));
          } else {
            observer.next(PaymentActions.paymentUpdateSuccessful({payment: result.payment}));
          }
        })
    }))
  ));

  deletePayment$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.deletePayment),
    tap(() => this.router.navigateByUrl('/')),
    mergeMap((action) => this.restService.deletePayment(action.payment.paymentId)
      .pipe(
        map(result => {
          if (result.code !== 200) {
            console.log(result.code, result.message);  // TODO: Show this in a toast message
            return PaymentActions.paymentDeleteFailed({payment: action.payment});
          } else {
            return PaymentActions.paymentDeleteSuccessful({paymentId: action.payment.paymentId});
          }
        })
      )
    )
  ));

  syncPayment$ = createEffect(() => this.actions$.pipe(  // TODO: What to do with local payments? What to do with payments that are already syncing?
    ofType(PaymentActions.syncPayments),
    withLatestFrom(
      this.store.select(LayoutSelectors.selectPagination),
      this.store.select(RouterSelectors.selectCurrentUrl)),
    mergeMap(([action, pagination, currentUrl]) => {
      const actions = [];
      // If payment details are displayed, look if there is an updated version on the server
      if (currentUrl.startsWith('/payment')) {
        const paymentId = currentUrl.split('/')[1];
         actions.push(PaymentActions.requestSinglePayment({paymentId: paymentId}));
      }
      // Update all payments in the current pagination
      actions.push(PaymentActions.requestPayments(pagination));
      return actions;
    })
  ));

  paymentUploadOrUpdateSuccessful$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.paymentUploadSuccessful, PaymentActions.paymentUpdateSuccessful),
    map((action) => PaymentActions.updatePaymentEntity({
        payment: {
          id: action.payment.paymentId,
          changes: {...action.payment, syncStatus: SyncStatusEnum.Remote}
        }
      })
    ))
  );

  paymentUploadFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.paymentUploadFailed),
    map((action) => PaymentActions.updatePaymentEntity({
      payment: {
        id: action.paymentId,
        changes: { syncStatus: SyncStatusEnum.Local }
      }
    })))
  );

  paymentUpdateFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.paymentUpdateFailed),
    map((action) => PaymentActions.updatePaymentEntity({
      payment: {
        id: action.paymentId,
        changes: { syncStatus: SyncStatusEnum.LocalUpdate }
      }
    })))
  );

  paymentDeleteFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.paymentDeleteFailed),
    map((action) =>  PaymentActions.addPaymentEntity(
      {payment: {...action.payment, syncStatus: SyncStatusEnum.LocalDelete}}
      ))
    )
  );

}
