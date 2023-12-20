import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, switchMap, take } from 'rxjs';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';
import { Category } from '../model/category';
import { CategoryDTO } from '../../../../domain';

const DEFAULT_PAGE_SIZE = 100;
const CATEGORIES_DB_PATH = '/categories';

const categoriesConverter = {
  toFirestore(user: Category): CategoryDTO {
    return user;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<CategoryDTO>,
    options: SnapshotOptions
  ): Category {
    return { name: snapshot.id, ...snapshot.data(options) };
  }
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories$ = new BehaviorSubject<Category[]>([]);
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

  private getCategoriesFromQuerySnapshot(snapshot: QuerySnapshot<Category>): Category[] {
    return snapshot.docs.map(doc => doc.data());
  }
}
