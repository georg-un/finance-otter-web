import { Injectable } from '@angular/core';
import { AngularFirestore, Query, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions } from '@angular/fire/compat/firestore';
import { BehaviorSubject, EMPTY, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { runObservableOnceNow } from '../utils';
import { PurchaseDTO } from '../../../../domain';
import { addUid, WithUid } from '../utils/with-uid';
import { HttpClient } from '@angular/common/http';
import { PURCHASE_API_URLS, PurchaseApiResponse } from '../../../../domain/purchase-api-models';

const DEFAULT_PAGE_SIZE = 10;
const PURCHASES_DB_PATH = '/purchases';

const purchaseConverter = {
  toFirestore(purchase: WithUid<PurchaseDTO>): PurchaseDTO {
    const { uid, ...purchaseDTO } = purchase;
    return purchaseDTO;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<PurchaseDTO>, options: SnapshotOptions): WithUid<PurchaseDTO> {
    return addUid(snapshot.data(options), snapshot.id);
  }
};

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  purchases$ = new BehaviorSubject<WithUid<PurchaseDTO>[]>([]);

  private readonly purchasesCollection = this.firestore.collection<PurchaseDTO>(PURCHASES_DB_PATH);
  private readonly initialQuery = this.purchasesCollection.ref
    .withConverter(purchaseConverter)
    .orderBy('date', 'desc')
    .limit(DEFAULT_PAGE_SIZE);
  private lastQuery?: Query<WithUid<PurchaseDTO>>;
  private lastDocumentInQuery?: QueryDocumentSnapshot<WithUid<PurchaseDTO>>;

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
  ) {
  }

  createPurchase(purchase: PurchaseDTO) {
    return this.http.post<PurchaseApiResponse['Create']>(PURCHASE_API_URLS.CREATE.get(), purchase).pipe(
      map((response) => response.id)
    );
  }

  updatePurchase(purchaseId: string, purchaseUpdate: PurchaseDTO) {
    return this.http.put<PurchaseApiResponse['Update']>(PURCHASE_API_URLS.UPDATE.get(purchaseId), purchaseUpdate);
  }

  deletePurchase(purchaseId: string) {
    return this.http.delete<PurchaseApiResponse['Delete']>(PURCHASE_API_URLS.DELETE.get(purchaseId));
  }

  getPurchase(purchaseId: string, skipCache = false) {
    const purchaseFromApi$ = this.purchasesCollection.doc(purchaseId).valueChanges().pipe(
      map((purchase) => {
        return purchase ? addUid(purchase, purchaseId) : undefined;
      })
    );
    if (skipCache) {
      return purchaseFromApi$.pipe(tap((purchaseFromApi) => {
        if (!purchaseFromApi) {
          return;
        }
        // update element in cache
        const updatedPurchases = this.purchases$.value.map((purchase) => (
          purchase.uid === purchaseFromApi.uid ? purchaseFromApi : purchase
        ));
        this.purchases$.next(updatedPurchases);
      }))
    }
    // Return the purchase from the store if it is present. Otherwise, call the API and return the response.
    return this.purchases$.pipe(
      map((purchases) => purchases.find((purchase) => purchase.uid === purchaseId)),
      switchMap((purchase) => {
        return purchase ? of(purchase) : purchaseFromApi$;
      })
    );
  }

  requestFirstPage() {
    this.resetPagination();
    return runObservableOnceNow(
      from(this.initialQuery.get()).pipe(
        tap((snapshot) => this.lastDocumentInQuery = snapshot.docs[0]),
        map((snapshot) => this.getPurchasesFromQuerySnapshot(snapshot)),
        tap((purchases) => this.purchases$.next(purchases)),
      )
    );
  }

  requestNextPage() {
    if (!this.lastQuery) {
      throw new Error('Property lastQuery must be defined when requesting the next page.');
    }
    if (!this.lastDocumentInQuery) {
      return EMPTY;  // if lastDocumentInQuery is undefined, we have reached the end of the results list
    }
    this.lastQuery = this.lastQuery.startAfter(this.lastDocumentInQuery);
    return this.runLatestQuery();
  }

  private runLatestQuery(): Observable<WithUid<PurchaseDTO>[]> {
    if (!this.lastQuery) {
      throw new Error('Property lastQuery must be defined when requesting the next page.');
    }
    return runObservableOnceNow(
      from(this.lastQuery.get()).pipe(
        tap((snapshot) => this.lastDocumentInQuery = snapshot.docs[snapshot.docs.length - 1]),
        map((snapshot) => this.getPurchasesFromQuerySnapshot(snapshot)),
        tap((purchases) => this.purchases$.next([...this.purchases$.value, ...purchases].sort(this.sortPurchasesByDateDescending)))
      )
    );
  }

  private resetPagination(): void {
    this.lastQuery = this.initialQuery;
    this.lastDocumentInQuery = undefined;
  }

  private getPurchasesFromQuerySnapshot(snapshot: QuerySnapshot<WithUid<PurchaseDTO>>) {
    return snapshot.docs.map(doc => doc.data());
  }

  private sortPurchasesByDateDescending(a: WithUid<PurchaseDTO>, b: WithUid<PurchaseDTO>) {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    return 0;
  }
}
