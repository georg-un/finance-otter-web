import { Observable } from "rxjs";
import { User } from "./entity/user";
import { Purchase } from "./entity/purchase";

export interface FinOBackendServiceInterface {

  fetchPurchases(offset: number, limit: number): Observable<Purchase[]>;

  fetchPurchase(purchaseId: string): Observable<Purchase>;

  fetchUsers(): Observable<User[]>;

  uploadNewPurchase(purchase: Purchase): Observable<{purchase: Purchase, code: number, message: string}>;

  updatePurchase(purchase: Purchase): Observable<{purchase: Purchase, code: number, message: string}>;

  deletePurchase(purchaseId: string): Observable<{purchaseId: string, code: number, message: string}>;

}
