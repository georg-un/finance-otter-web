import {Injectable} from '@angular/core';
import {FinOBackendServiceInterface} from '../fino-backend.service.interface';
import {Observable, of} from 'rxjs';
import {Purchase, SyncStatusEnum} from '../entity/purchase';
import {DEMO_PURCHASES} from './data/demo-purchases';
import {User} from '../entity/user';
import {DEMO_USERS} from './data/demo-users';
import {cloneDeep} from 'lodash-es';
import {Category} from '../entity/category';
import {DEMO_CATEGORIES} from './data/demo-categories';
import {CategoryMonthSummary, CategorySummary} from '../entity/summaries';

interface UserAmounts {
  [userId: string]: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemoBackendService implements FinOBackendServiceInterface {

  private purchases: Purchase[] = DEMO_PURCHASES;
  private users: User[] = DEMO_USERS;
  private categories: Category[] = DEMO_CATEGORIES;
  private receipts: { [purchaseId: string]: Blob } = {};

  checkIfUserActive(): Observable<boolean> {
    return of(true);
  }

  fetchPurchases(offset: number, limit: number): Observable<Purchase[]> {
    return of(this.purchases.slice(offset, offset + limit));
  }

  fetchPurchase(purchaseId: string): Observable<Purchase> {
    return of(this.purchases.find(p => p.purchaseId === purchaseId));
  }

  fetchUsers(): Observable<User[]> {
    return of(this.users);
  }

  fetchCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  fetchReceipt(purchaseId: string): Observable<Blob> {
    return of(this.receipts[purchaseId]);
  }

  uploadNewPurchase(purchase: Purchase, receipt: Blob): Observable<Purchase> {
    this.receipts[purchase.purchaseId] = receipt;
    this.purchases.push(purchase);
    return of(cloneDeep(purchase));
  }

  updatePurchase(purchase: Purchase): Observable<Purchase> {
    this.purchases = this.purchases.map(p => p.purchaseId === purchase.purchaseId ? purchase : p);
    return of(purchase);
  }

  deletePurchase(purchaseId: string): Observable<Object> {
    this.purchases = this.purchases.filter(p => p.purchaseId !== purchaseId);
    return of(true);
  }

  updateReceipt(purchaseId: string, receipt: Blob): Observable<Object> {
    this.receipts[purchaseId] = receipt;
    return of(true);
  }

  deleteReceipt(purchaseId: string): Observable<Object> {
    delete this.receipts[purchaseId];
    return of(true);
  }

  fetchBalances(): Observable<Object> {
    const liabilities = this.getLiabilities();
    const credits = this.getCredits();
    const balances: UserAmounts = {};
    this.users.forEach(user => {
      balances[user.userId] = credits[user.userId] - liabilities[user.userId];
    });
    return of({balances: balances});
  }

  fetchCategorySummary(months: number): Observable<CategorySummary[]> {
    const filteredPurchases = this.getPurchasesBetweenMonths(months || 3);
    return of(this.getCategorySummaries(filteredPurchases));
  }

  fetchCategoryMonthSummary(months: number): Observable<CategoryMonthSummary[]> {
    const _months = months || 3;
    const categoryMonthSummaries: CategoryMonthSummary[] = [];
    for (let m = 0; m <= _months; m++) {
      const date = new Date();
      date.setMonth(date.getMonth() - m);
      const year = date.getFullYear().toString();
      let month = (date.getMonth() + 1).toString();
      month = month.length === 2 ? month : '0' + month;  // make sure month strings consist of two digits
      const filteredPurchases = this.getPurchasesBetweenMonths(m + 1, m);
      categoryMonthSummaries.push(
        {
          name: year + '.' + month,
          series: this.getCategorySummaries(filteredPurchases)
        }
      );
    }
    return of(categoryMonthSummaries);
  }

  private getLiabilities(): UserAmounts {
    const liabilities: UserAmounts = {};
    this.users.forEach(user => {
      liabilities[user.userId] = this.purchases
        .map(p => p.debits.find(d => d.debtorId === user.userId)?.amount)
        .reduce(this.add, 0);
    });
    return liabilities;
  }

  private getCredits(): UserAmounts {
    const credits: UserAmounts = {};
    this.users.forEach(user => {
      credits[user.userId] = this.purchases
        .filter(p => p.buyerId === user.userId)
        .map(p => this.getDebitsAmount(p))
        .reduce(this.add, 0);
    });
    return credits;
  }

  private getCategorySummaries(purchases: Purchase[]): CategorySummary[] {
    return this.categories.map(category => {
      return {
        categoryId: category.id,
        value: purchases
          .filter(p => p.categoryId === category.id)
          .map(p => this.getDebitsAmount(p))
          .reduce(this.add, 0)
      } as CategorySummary;
    });
  }

  private getPurchasesBetweenMonths(startMonthOffset: number, endMonthOffset = 0): Purchase[] {
    const startDateInMs = new Date().setMonth(new Date().getMonth() - startMonthOffset);
    const endDateInMs = new Date().setMonth(new Date().getMonth() - endMonthOffset);
    return this.purchases.filter(p => p.date > startDateInMs && p.date <= endDateInMs);
  }

  private getDebitsAmount(purchase: Purchase): number {
    return purchase.debits.map(d => d.amount).reduce(this.add, 0);
  }

  private add(acc: number, x: number): number {
    return acc + x || 0;
  }
}
