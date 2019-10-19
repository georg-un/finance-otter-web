import { Injectable } from '@angular/core';
import { Transaction } from './entity/transaction';
import { TRANSACTION1 } from './mock-data/transaction1';
import { TRANSACTIONS } from './mock-data/transactions';
import { Payment } from './entity/payment';
import { PAYMENT1 } from './mock-data/payment1';
import { User } from './entity/user';
import { USERS } from './mock-data/users';
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class MockRestService {

  constructor() { }

  fetchTransaction(transactionId: number): Observable<Transaction> {
    return of(TRANSACTION1).pipe(delay(1000));
  }

  fetchTransactions(offset: number, limit: number): Observable<Transaction[]> {
    return of(TRANSACTIONS).pipe(delay(1500));
  }

  fetchPayment(transactionId: number): Observable<Payment> {
    return of(PAYMENT1).pipe(delay(1500));
  }

  fetchUsers(): Observable<User[]> {
    return of(USERS).pipe(delay(1500));
  }

  fetchCurrentUser(): Observable<User> {
    return of(USERS[0]).pipe(delay(1000));
  }

}
