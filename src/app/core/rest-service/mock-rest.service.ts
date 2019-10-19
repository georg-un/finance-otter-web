import { Injectable } from '@angular/core';
import { Transaction } from './entity/transaction';
import { TRANSACTION1 } from './mock-data/transaction1';
import { TRANSACTIONS } from './mock-data/transactions';
import { Payment } from './entity/payment';
import { PAYMENT1 } from './mock-data/payment1';
import { User } from './entity/user';
import { USERS } from './mock-data/users';
import { Observable, of } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MockRestService {

  constructor() { }

  fetchTransaction(transactionId: number): Transaction {
    return TRANSACTION1;
  }

  fetchTransactions(offset: number, limit: number): Observable<Transaction[]> {
    return of(TRANSACTIONS);
  }

  fetchPayment(transactionId: number): Observable<Payment> {
    return of(PAYMENT1);
  }

  fetchUsers(): Observable<User[]> {
    return of(USERS);
  }

  fetchCurrentUser(): User {
    return USERS[0];
  }

}
