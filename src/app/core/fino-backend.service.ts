import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FinOBackendServiceInterface } from './fino-backend.service.interface';
import { Observable, throwError } from 'rxjs';
import { Purchase } from './entity/purchase';
import { environment } from '../../environments/environment';
import { User } from './entity/user';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MultilineSnackbarComponent } from '../shared/multiline-snackbar/multiline-snackbar.component';
import { ChartSeries } from './entity/chart-series';
import { ChartData } from './entity/chart-data';

@Injectable({
  providedIn: 'root'
})
export class FinOBackendService implements FinOBackendServiceInterface {

  private endpoints = {
    users: environment.backendUrl + '/users',
    purchases: environment.backendUrl + '/purchases',
    summary: environment.backendUrl + '/summary'
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

  fetchReceipt(purchaseId: string): Observable<Blob> {
    return this.http.get(
      `${this.endpoints.purchases}/${purchaseId}/receipt`,
      {responseType: 'blob'}).pipe(
      catchError((err => this.handleError(err)))
    );
  }

  uploadNewPurchase(purchase: Purchase, receipt: Blob): Observable<Purchase> {
    const uploadForm = new FormData();
    uploadForm.append('purchase', JSON.stringify(purchase));
    uploadForm.append('receipt', receipt);
    return this.http.post<Purchase>(this.endpoints.purchases, uploadForm).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  updatePurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(this.endpoints.purchases, purchase).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  deletePurchase(purchaseId: string): Observable<Object> {
    return this.http.delete(`${this.endpoints.purchases}/${purchaseId}`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  updateReceipt(purchaseId: string, receipt: Blob): Observable<Object> {
    const uploadForm = new FormData();
    uploadForm.append('receipt', receipt);
    return this.http.put(`${this.endpoints.purchases}/${purchaseId}/receipt`, uploadForm).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  deleteReceipt(purchaseId: string): Observable<Object> {
    return this.http.delete(`${this.endpoints.purchases}/${purchaseId}/receipt`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  fetchBalances(): Observable<Object> {
    return this.http.get<Object>(this.endpoints.summary + '/balance').pipe(
      catchError((err) => this.handleError(err))
    );
  }

  fetchCategoryMonthSummary(months: number): Observable<ChartSeries[]> {
    let params = new HttpParams();
    params = params.set('offset', months.toString());
    return this.http.get<ChartSeries[]>(this.endpoints.summary + '/month_category', {params: params}).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  fetchCategorySummary(months: number): Observable<ChartData[]> {
    let params = new HttpParams();
    params = params.set('offset', months.toString());
    return this.http.get<ChartData[]>(this.endpoints.summary + '/category', {params: params}).pipe(
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
