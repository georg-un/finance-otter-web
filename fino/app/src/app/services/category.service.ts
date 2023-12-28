import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, switchMap, take } from 'rxjs';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';
import { CategoryDTO } from '../../../../domain';
import { WithUid } from '../utils/with-uid';

const DEFAULT_PAGE_SIZE = 100;
const CATEGORIES_DB_PATH = '/categories';

const categoriesConverter = {
  toFirestore(category: WithUid<CategoryDTO>): CategoryDTO {
    const { uid, ...categoryDTO } = category;
    return categoryDTO;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<CategoryDTO>,
    options: SnapshotOptions
  ): WithUid<CategoryDTO> {
    return { uid: snapshot.id, ...snapshot.data(options) };
  }
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories$ = new BehaviorSubject<WithUid<CategoryDTO>[]>([]);
  activeCategories$ = this.categories$.pipe(
    map((categories) => categories.filter((category) => category.active))
  );

  private readonly categoryCollection = this.firestore.collection<CategoryDTO>(CATEGORIES_DB_PATH);
  private readonly initialQuery = this.categoryCollection.ref
    .withConverter(categoriesConverter)
    .limit(DEFAULT_PAGE_SIZE);

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.authService.isLoggedIn.pipe(
      filter(Boolean),
      take(1),
      switchMap(() => from(this.initialQuery.get())),
      map((categorySnapshot) => this.getCategoriesFromQuerySnapshot(categorySnapshot))
    ).subscribe((categories) => {
      this.categories$.next(categories);
    });
  }

  getByUid(uid: string): Observable<WithUid<CategoryDTO> | undefined> {
    return this.categories$.pipe(
      map((categories) => categories.find((category) => category.uid === uid))
    );
  }

  private getCategoriesFromQuerySnapshot(snapshot: QuerySnapshot<WithUid<CategoryDTO>>): WithUid<CategoryDTO>[] {
    return snapshot.docs.map(doc => doc.data());
  }
}
