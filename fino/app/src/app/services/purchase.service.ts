import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  SnapshotOptions
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, EMPTY, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Purchase, purchaseFromPurchaseDTO } from '../model/purchase';
import { runObservableOnceNow } from '../utils';
import { PurchaseDTO } from '../../../../domain';

const DEFAULT_PAGE_SIZE = 10;
const PURCHASES_DB_PATH = '/purchases';

const purchaseConverter = {
  toFirestore(purchase: Purchase): PurchaseDTO {
    const { uid, ...purchaseDTO} = purchase;
    return purchaseDTO;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<PurchaseDTO>, options: SnapshotOptions): Purchase {
    return purchaseFromPurchaseDTO(snapshot.id, snapshot.data(options));
  }
};

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  purchases$ = new BehaviorSubject<Purchase[]>([]);

  private readonly purchasesCollection = this.firestore.collection<PurchaseDTO>(PURCHASES_DB_PATH);
  private readonly initialQuery = this.purchasesCollection.ref
    .withConverter(purchaseConverter)
    .orderBy('date', 'desc')
    .limit(DEFAULT_PAGE_SIZE);
  private lastQuery?: Query<Purchase>;
  private lastDocumentInQuery?: QueryDocumentSnapshot<Purchase>;

  constructor(private firestore: AngularFirestore) {
  }

  createPurchase(purchase: Purchase) {
    return from(this.purchasesCollection.add(purchase)).pipe(
      map((docRef) => docRef.id)
    );
  }

  getPurchase(purchaseId: string, skipCache = false) {
    const purchaseFromApi$ = this.purchasesCollection.doc(purchaseId).valueChanges().pipe(
      map((purchase) => {
        return purchase ? purchaseFromPurchaseDTO(purchaseId, purchase) : undefined;
      })
    );
    if (skipCache) {
      return purchaseFromApi$;
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

  private getPurchasesFromQuerySnapshot(snapshot: QuerySnapshot<Purchase>) {
    return snapshot.docs.map(doc => doc.data());
  }

  private sortPurchasesByDateDescending(a: Purchase, b: Purchase) {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    return 0;
  }
}
