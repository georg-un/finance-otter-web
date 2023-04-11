import { Observable } from 'rxjs';
import { User } from './entity/user';
import { Purchase } from './entity/purchase';

export interface FinOBackendServiceInterface {

  fetchPurchases(offset: number, limit: number): Observable<Purchase[]>;

  fetchPurchase(purchaseId: string): Observable<Purchase>;

  fetchUsers(): Observable<User[]>;

  uploadNewPurchase(purchase: Purchase, receipt: Blob): Observable<Purchase>;

  updatePurchase(purchase: Purchase): Observable<Purchase>;

  deletePurchase(purchaseId: string): Observable<Object>;

  updateReceipt(purchaseId: string, receipt: Blob): Observable<Object>;

  deleteReceipt(purchaseId: string): Observable<Object>;

}
