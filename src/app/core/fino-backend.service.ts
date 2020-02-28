import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { FinOBackendServiceInterface } from "./fino-backend.service.interface";
import { Observable } from "rxjs";
import { Payment } from "./entity/payment";
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

  fetchPayments(offset: number, limit: number): Observable<Payment[]> {
    let params = new HttpParams();
    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());
    return this.http.get<Payment[]>(this.endpoints.purchases, {params: params});
  }

  fetchPayment(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(this.endpoints.purchases + `/${paymentId}`);  // TODO: check
  };

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoints.users)
  }

  uploadNewPayment(payment: Payment): Observable<{ payment: Payment; code: number; message: string; }> {
    return this.http.post(this.endpoints.purchases, payment).pipe(
      map((response: HttpResponse<Payment>) => {
        return {
          payment: response.body,
          code: response.status,
          message: response.statusText
        }
      })
    );
  }

  updatePayment(payment: Payment): Observable<{ payment: Payment; code: number; message: string }> {
    return this.http.put(this.endpoints.purchases, payment).pipe(
      map((response: HttpResponse<Payment>) => {
        return {
          payment: response.body,
          code: response.status,
          message: response.statusText
        }
      })
    );
  }

  deletePayment(paymentId: string): Observable<{ paymentId: string; code: number; message: string }> {
    return this.http.delete(this.endpoints.purchases + `${paymentId}`).pipe(
      map((response: HttpResponse<string>) => {
        return {
          paymentId: response.body,
          code: response.status,
          message: response.statusText
        }
      })
    );
  }

}
