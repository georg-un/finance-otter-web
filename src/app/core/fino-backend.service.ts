import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { FinOBackendServiceInterface } from "./fino-backend.service.interface";
import { Observable } from "rxjs";
import { Purchase } from "./entity/purchase";
import { environment } from '../../environments/environment';
import { User } from './entity/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinOBackendService implements FinOBackendServiceInterface {

  private endpoints = {
    users: environment.backendUrl + '/users',
    purchases: environment.backendUrl + '/purchases'
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  fetchPurchases(offset: number, limit: number): Observable<Purchase[]> {
    let params = new HttpParams();
    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());
    return this.http.get<Purchase[]>(this.endpoints.purchases, {params: params});
  }

  fetchPurchase(purchaseId: string): Observable<Purchase> {
    return this.http.get<Purchase>(this.endpoints.purchases + `/${purchaseId}`);  // TODO: check
  };

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoints.users)
  }

  uploadNewPurchase(purchase: Purchase): Observable<{ purchase: Purchase; code: number; message: string; }> {
    return this.http.post(this.endpoints.purchases, purchase).pipe(
      map((response: HttpResponse<Purchase>) => {
        return {
          purchase: response.body,
          code: response.status,
          message: response.statusText
        }
      })
    );
  }

  updatePurchase(purchase: Purchase): Observable<{ purchase: Purchase; code: number; message: string }> {
    return this.http.put(this.endpoints.purchases, purchase).pipe(
      map((response: HttpResponse<Purchase>) => {
        return {
          purchase: response.body,
          code: response.status,
          message: response.statusText
        }
      })
    );
  }

  deletePurchase(purchaseId: string): Observable<{ purchaseId: string; code: number; message: string }> {
    return this.http.delete(this.endpoints.purchases + `/${purchaseId}`).pipe(
      map((response: HttpResponse<string>) => {
        return {
          purchaseId: response.body,
          code: response.status,
          message: response.statusText
        }
      })
    );
  }

}
