import { Injectable } from '@angular/core';
import { USERS } from './mock-data/users';
import { PAYMENT1 } from './mock-data/payment1';
import { PAYMENTS } from './mock-data/payments';
import { Payment } from './entity/payment';
import { User } from './entity/user';
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";


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
    return of({payment: payment, code: 200, message: null}).pipe(
      delay(500)
    );
  }

}
