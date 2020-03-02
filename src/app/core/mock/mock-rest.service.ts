import { Injectable } from '@angular/core';
import { USERS } from './data/users';
import { PURCHASE1 } from './data/purchase1';
import { PURCHASES } from './data/purchases';
import { Purchase } from '../entity/purchase';
import { User } from '../entity/user';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FinOBackendServiceInterface } from "../fino-backend.service.interface";


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

  uploadNewPurchase(purchase: Purchase): Observable<{purchase: Purchase, code: number, message: string}> {
    const returnedPurchase = Object.assign({}, purchase);
    return of({purchase: returnedPurchase, code: 200, message: null}).pipe(
      delay(2500)
    );
  }

  updatePurchase(purchase: Purchase): Observable<{purchase: Purchase, code: number, message: string}> {
    const returnedPurchase = Object.assign({}, purchase);
    return of({purchase: returnedPurchase, code: 200, message: null}).pipe(
      delay(2500)
    );
  }

  deletePurchase(purchaseId: string): Observable<{purchaseId: string, code: number, message: string}> {
    return of({purchaseId: purchaseId, code: 200, message: null}).pipe(
      delay(2500)
    );
  }

}
