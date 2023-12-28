import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, switchMap, take } from 'rxjs';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';
import { UserDTO } from '../../../../domain';
import { addUid, WithUid } from '../utils/with-uid';

const DEFAULT_PAGE_SIZE = 100;
const USERS_DB_PATH = '/users';

const userConverter = {
  toFirestore(user: WithUid<UserDTO>): UserDTO {
    return user;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<UserDTO>,
    options: SnapshotOptions
  ): WithUid<UserDTO> {
    const userDTO = snapshot.data(options);
    userDTO.photoUrl = userDTO.photoUrl ?? '';  // TODO

    return addUid(userDTO, snapshot.id);
  }
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users$ = new BehaviorSubject<WithUid<UserDTO>[]>([]);

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

  getByUid(uid: string): Observable<WithUid<UserDTO> | undefined> {
    return this.users$.pipe(
      filter(Boolean),
      map((users) => users.find((user) => user.uid === uid))
    );
  }

  private getUsersFromQuerySnapshot(snapshot: QuerySnapshot<WithUid<UserDTO>>): UserDTO[] {
    return snapshot.docs.map(doc => doc.data());
  }
}
