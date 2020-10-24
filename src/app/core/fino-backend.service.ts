import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FinOBackendServiceInterface } from './fino-backend.service.interface';
import { MonoTypeOperatorFunction, Observable, throwError } from 'rxjs';
import { Purchase } from './entity/purchase';
import { environment } from '../../environments/environment';
import { User } from './entity/user';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MultilineSnackbarComponent } from '../shared/multiline-snackbar/multiline-snackbar.component';
import { Category } from './entity/category';
import { CategoryMonthSummary, CategorySummary } from './entity/summaries';

@Injectable({
  providedIn: 'root'
})
export class FinOBackendService implements FinOBackendServiceInterface {

  private readonly endpoints = {
    users: environment.backendUrl + '/users',
    purchases: environment.backendUrl + '/purchases',
    categories: environment.backendUrl + '/categories',
    summary: environment.backendUrl + '/summary'
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
  }

  checkIfUserActive(): Observable<boolean> {
    return this.http.get<boolean>(this.endpoints.users + '/current').pipe(
      this.handleRequestFailure()
    );
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(this.endpoints.users, user).pipe(
      this.handleRequestFailure()
    );
  }

  fetchPurchases(offset: number, limit: number): Observable<Purchase[]> {
    let params = new HttpParams();
    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());
    return this.http.get<Purchase[]>(this.endpoints.purchases, {params: params}).pipe(
      this.handleRequestFailure()
    );
  }

  fetchPurchase(purchaseId: string): Observable<Purchase> {
    return this.http.get<Purchase>(this.endpoints.purchases + `/${purchaseId}`).pipe(
      this.handleRequestFailure()
    );
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoints.users).pipe(
      this.handleRequestFailure()
    );
  }

  fetchCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.endpoints.categories).pipe(
      this.handleRequestFailure()
    );
  }

  fetchReceipt(purchaseId: string): Observable<Blob> {
    return this.http.get(
      `${this.endpoints.purchases}/${purchaseId}/receipt`,
      {responseType: 'blob'}).pipe(
      this.handleRequestFailure()
    );
  }

  uploadNewPurchase(purchase: Purchase, receipt: Blob): Observable<Purchase> {
    const uploadForm = new FormData();
    uploadForm.append(
      'purchase',
      // Convert purchase to a Blob, since JSON is not supported by multipart/form-data
      new Blob([JSON.stringify(purchase)], {type: 'application/json;'})
    );
    uploadForm.append('receipt', receipt);
    return this.http.post<Purchase>(this.endpoints.purchases, uploadForm).pipe(
      this.handleRequestFailure()
    );
  }

  updatePurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(this.endpoints.purchases, purchase).pipe(
      this.handleRequestFailure()
    );
  }

  deletePurchase(purchaseId: string): Observable<Object> {
    return this.http.delete(`${this.endpoints.purchases}/${purchaseId}`).pipe(
      this.handleRequestFailure()
    );
  }

  updateReceipt(purchaseId: string, receipt: Blob): Observable<Object> {
    const uploadForm = new FormData();
    uploadForm.append('receipt', receipt);
    return this.http.put(`${this.endpoints.purchases}/${purchaseId}/receipt`, uploadForm).pipe(
      this.handleRequestFailure()
    );
  }

  deleteReceipt(purchaseId: string): Observable<Object> {
    return this.http.delete(`${this.endpoints.purchases}/${purchaseId}/receipt`).pipe(
      this.handleRequestFailure()
    );
  }

  fetchBalances(): Observable<Object> {
    return this.http.get<Object>(this.endpoints.summary + '/balance').pipe(
      this.handleRequestFailure()
    );
  }

  fetchCategoryMonthSummary(months: number): Observable<CategoryMonthSummary[]> {
    let params = new HttpParams();
    params = params.set('months', months.toString());
    return this.http.get<CategoryMonthSummary[]>(this.endpoints.summary + '/month_category', {params: params}).pipe(
      this.handleRequestFailure()
    );
  }

  fetchCategorySummary(months: number): Observable<CategorySummary[]> {
    let params = new HttpParams();
    params = params.set('months', months.toString());
    return this.http.get<CategorySummary[]>(this.endpoints.summary + '/category', {params: params}).pipe(
      this.handleRequestFailure()
    );
  }

  private handleRequestFailure<T>(): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => source.pipe(
      retry(3),
      catchError(err => this.handleError(err))
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, ` + `body was:`);
      console.error(error.error);
    }
    // Show a snackbar
    this.snackBar.openFromComponent(MultilineSnackbarComponent, {
      data: error.status === 400 ? error.error : null
    });
    // return an observable with a user-facing error message
    return throwError(error.error);
  }

}
