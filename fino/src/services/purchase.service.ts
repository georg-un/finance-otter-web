import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  DocumentReference,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  SnapshotOptions
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, EMPTY, from, map, Observable, tap } from 'rxjs';
import { Purchase } from '../model/purchase';
import { runObservableOnceNow } from '../app/utils';

const DEFAULT_PAGE_SIZE = 3;
const PURCHASES_DB_PATH = '/purchases';

const purchaseConverter = {
  toFirestore(purchase: Purchase): DocumentData {
    return purchase;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<Purchase>,
    options: SnapshotOptions
  ): Purchase {
    return { uid: snapshot.id, ...snapshot.data(options) };
  }
};

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  purchases$ = new BehaviorSubject<Purchase[]>([]);

  private readonly purchasesCollection = this.firestore.collection<Purchase>(PURCHASES_DB_PATH);
  private readonly initialQuery = this.purchasesCollection.ref
    .withConverter(purchaseConverter)
    .orderBy('date', 'desc')
    .limit(DEFAULT_PAGE_SIZE);
  private lastQuery?: Query<Purchase>;
  private lastDocumentInQuery?: QueryDocumentSnapshot<Purchase>;

  constructor(private firestore: AngularFirestore) {
  }

  createPurchase(purchase: Purchase): Observable<DocumentReference<Purchase>> {
    return from(this.purchasesCollection.add(purchase));
  }

  requestFirstPage(): Observable<Purchase[]> {
    this.resetPagination();
    return runObservableOnceNow(
      from(this.initialQuery.get()).pipe(
        tap((snapshot) => this.lastDocumentInQuery = snapshot.docs[0]),
        map((snapshot) => this.getPurchasesFromQuerySnapshot(snapshot)),
        tap((purchases) => this.purchases$.next(purchases)),
      )
    );
  }

  requestNextPage(): Observable<Purchase[]> {
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
        tap((purchases) => this.purchases$.next([...this.purchases$.value, ...purchases]))
      )
    );
  }

  private resetPagination(): void {
    this.lastQuery = this.initialQuery;
    this.lastDocumentInQuery = undefined;
  }

  private getPurchasesFromQuerySnapshot(snapshot: QuerySnapshot<Purchase>): Purchase[] {
    return snapshot.docs.map(doc => doc.data());
  }
}
