import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { FinOBackendServiceInterface } from './fino-backend.service.interface';
import { Observable, throwError } from 'rxjs';
import { Purchase } from './entity/purchase';
import { environment } from '../../environments/environment';
import { User } from './entity/user';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MultilineSnackbarComponent } from '../shared/multiline-snackbar/multiline-snackbar.component';

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
    private snackBar: MatSnackBar
  ) {
  }

  checkIfUserActive(): Observable<boolean> {
    return this.http.get<boolean>(this.endpoints.users + '/current').pipe(
      catchError((err) => this.handleError(err))
    );
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(this.endpoints.users, user).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  fetchPurchases(offset: number, limit: number): Observable<Purchase[]> {
    let params = new HttpParams();
    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());
    return this.http.get<Purchase[]>(this.endpoints.purchases, {params: params}).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  fetchPurchase(purchaseId: string): Observable<Purchase> {
    return this.http.get<Purchase>(this.endpoints.purchases + `/${purchaseId}`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoints.users).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  uploadNewPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.endpoints.purchases, purchase).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  updatePurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(this.endpoints.purchases, purchase).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  deletePurchase(purchaseId: string): Observable<Object> {
    return this.http.delete(this.endpoints.purchases + `/${purchaseId}`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // Show a snackbar
    this.snackBar.openFromComponent(MultilineSnackbarComponent, {
      data: error.status === 400 ? error.error : null
    });
    // return an observable with a user-facing error message
    return throwError(error.error);
  }

}
