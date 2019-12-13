import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { MockRestService } from '../../core/rest-service/mock-rest.service';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { Payment, SyncStatusEnum } from '../../core/rest-service/entity/payment';
import { PaymentActions } from '../actions/payment.actions';
import { Store } from '@ngrx/store';
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
    mergeMap((action) => this.restService.uploadNewPayment(action.payment)
      .pipe(
        map(result => {
          if (result.code !== 200) {
            console.log(result.code, result.message);  // TODO: Show this in a toast message
            const localUpdate: Update<Payment> = {
              id: result.payment.paymentId,
              changes: {syncStatus: SyncStatusEnum.Local}
            };
            return PaymentActions.paymentUploadFailed({payment: localUpdate});
          } else {
            const remoteUpdate: Update<Payment> = {
              id: result.payment.paymentId,
              changes: {syncStatus: SyncStatusEnum.Remote}
            };
            return PaymentActions.paymentUploadSuccessful({payment: remoteUpdate});
          }
        }))
    )
  ));

  syncPayment$ = createEffect(() => this.actions$.pipe(  // TODO: What to do with local payments?
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

}
