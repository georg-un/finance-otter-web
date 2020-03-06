import { Injectable } from '@angular/core';
import { USERS } from './data/users';
import { PURCHASE1 } from './data/purchase1';
import { PURCHASES } from './data/purchases';
import { Purchase } from '../entity/purchase';
import { User } from '../entity/user';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FinOBackendServiceInterface } from '../fino-backend.service.interface';


@Injectable({
  providedIn: 'root'
})
export class MockRestService implements FinOBackendServiceInterface {

  constructor() { }

  fetchPurchases(offset: number, limit: number): Observable<Purchase[]> {
    return of(PURCHASES).pipe(delay(1500));
  }

  fetchPurchase(purchaseId: string): Observable<Purchase> {
    return of(PURCHASE1).pipe(delay(1500));
  }

  fetchUsers(): Observable<User[]> {
    return of(USERS).pipe(delay(1500));
  }

  uploadNewPurchase(purchase: Purchase): Observable<Purchase> {
    return of(Object.assign({}, purchase)).pipe(
      delay(2500)
    );
  }

  updatePurchase(purchase: Purchase): Observable<Purchase> {
    return of(Object.assign({}, purchase)).pipe(
      delay(2500)
    );
  }

  deletePurchase(purchaseId: string): Observable<Object> {
    return of(undefined).pipe(
      delay(2500)
    );
  }

}
