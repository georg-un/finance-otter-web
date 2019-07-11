import { Injectable } from '@angular/core';
import {Transaction} from './entity/transaction';
import {TRANSACTION1} from './mock-data/transaction1';
import {TRANSACTIONS} from './mock-data/transactions';
import {Payment} from './entity/payment';
import {PAYMENT1} from './mock-data/payment1';
import {User} from './entity/user';
import {USERS} from './mock-data/users';


@Injectable({
  providedIn: 'root'
})
export class MockRestService {

  constructor() { }

  fetchTransaction(transactionId: number): Transaction {
    return TRANSACTION1;
  }

  fetchTransactions(): Transaction[] {
    return TRANSACTIONS;
  }

  fetchPayment(transactionId: number): Payment {
    return PAYMENT1;
  }

  fetchUsers(): User[] {
    return USERS;
  }

  fetchCurrentUser(): User {
    return USERS[0];
  }

}
