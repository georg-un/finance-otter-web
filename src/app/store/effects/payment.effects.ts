import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { MockRestService } from '../../core/rest-service/mock-rest.service';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { Payment, SyncStatusEnum } from '../../core/rest-service/entity/payment';
import { PaymentActions } from '../actions/payment.actions';

@Injectable()
export class PaymentEffects {

  constructor(private actions$: Actions,
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

}
