import { Injectable } from '@angular/core';
import { USERS } from './mock-data/users';
import { PAYMENT1 } from './mock-data/payment1';
import { PAYMENTS } from './mock-data/payments';
import { Payment } from './entity/payment';
import { User } from './entity/user';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MockRestService {

  constructor() { }

  fetchPayments(offset: number, limit: number): Observable<Payment[]> {
    return of(PAYMENTS).pipe(delay(1500));
  }

  fetchPayment(paymentId: string): Observable<Payment> {
    return of(PAYMENT1).pipe(delay(1500));
  }

  fetchUsers(): Observable<User[]> {
    return of(USERS).pipe(delay(1500));
  }

  uploadNewPayment(payment: Payment): Observable<{payment: Payment, code: number, message: string}> {
    const returnedPayment = Object.assign({}, payment);
    return of({payment: returnedPayment, code: 200, message: null}).pipe(
      delay(2500)
    );
  }

  updatePayment(payment: Payment): Observable<{payment: Payment, code: number, message: string}> {
    const returnedPayment = Object.assign({}, payment);
    return of({payment: returnedPayment, code: 200, message: null}).pipe(
      delay(2500)
    );
  }

  deletePayment(paymentId: string): Observable<{paymentId: string, code: number, message: string}> {
    return of({paymentId: paymentId, code: 200, message: null}).pipe(
      delay(2500)
    );
  }

}
