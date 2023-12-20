import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, switchMap, take } from 'rxjs';
import { User } from '../model/user';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';
import { UserDTO } from '../../../../domain';

const DEFAULT_PAGE_SIZE = 100;
const USERS_DB_PATH = '/users';

const userConverter = {
  toFirestore(user: User): UserDTO {
    return user;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<UserDTO>,
    options: SnapshotOptions
  ): User {
    const userDTO = snapshot.data(options);
    return {
      photoURL: userDTO.photoUrl ?? '',  // TODO
      ...userDTO
    };
  }
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users$ = new BehaviorSubject<User[]>([]);

  private readonly usersCollection = this.firestore.collection<UserDTO>(USERS_DB_PATH);
  private readonly initialQuery = this.usersCollection.ref
    .withConverter(userConverter)
    .orderBy('displayName', 'desc')
    .limit(DEFAULT_PAGE_SIZE);

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.authService.isLoggedIn.pipe(
      filter(Boolean),
      take(1),
      switchMap(() => from(this.initialQuery.get())),
      map((users) => this.getUsersFromQuerySnapshot(users))
    ).subscribe((users) => {
      this.users$.next(users);
    });
  }

  private getUsersFromQuerySnapshot(snapshot: QuerySnapshot<User>): User[] {
    return snapshot.docs.map(doc => doc.data());
  }
}
