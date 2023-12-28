import { inject, Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider, User as FirebaseUser } from '@firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WithUid } from '../utils/with-uid';
import { UserDTO } from '../../../../domain';

export function isAuthenticated(): boolean {
  const auth = inject(AuthService);
  return auth.isLoggedIn.value || !auth.initialized.value;
}

export const LOGIN_PATH = 'login';
const REDIRECT_PARAM_KEY = 'redirectTo';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly currentUser = new BehaviorSubject<WithUid<UserDTO> | null>(null);
  readonly initialized = new BehaviorSubject<boolean>(false);
  readonly isLoggedIn = new BehaviorSubject<boolean>(false);

  private readonly provider = new GoogleAuthProvider();

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
  ) {
    void this.firebaseAuth.onAuthStateChanged((user) => this.onAuthStateChanged(user as FirebaseUser));
  }

  signInWithPopup(): void {
    void this.firebaseAuth.signInWithPopup(this.provider);
  }

  signOut(): void {
    void this.firebaseAuth.signOut();
  }

  private onAuthStateChanged(user: FirebaseUser): void {
    const loggedIn = !!user;
    this.currentUser.next(loggedIn ? this.firebaseUserToUserDTO(user) : null);

    // ignore if the service is already initialized and the auth state did not change
    if (loggedIn === this.isLoggedIn.value && this.initialized.value) {
      return;
    }

    if (!loggedIn && !this.isOnLoginPage()) {
      this.redirectToLoginPage();
    } else if (loggedIn && this.isOnLoginPage()) {
      this.redirectToApp();
    }

    this.isLoggedIn.next(loggedIn);

    if (!this.initialized.value) {
      this.initialized.next(true);
    }
  }

  private redirectToApp(): void {
    const redirectQueryParam = this.route.snapshot.queryParams[REDIRECT_PARAM_KEY];
    this.ngZone.run(() => {
      void this.router.navigateByUrl(this.decodeRedirectQueryParam(redirectQueryParam), { replaceUrl: true });
    });
  }

  private redirectToLoginPage(): void {
    this.ngZone.run(() => {
      void this.router.navigate([LOGIN_PATH], {
        queryParams: this.encodeCurrentRoute(),
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  }

  private isOnLoginPage(): boolean {
    return this.router.url.includes(LOGIN_PATH);
  }

  private encodeCurrentRoute(): { [REDIRECT_PARAM_KEY]: string } {
    return { [REDIRECT_PARAM_KEY]: encodeURI(this.router.url) };
  }

  private decodeRedirectQueryParam(redirectTo?: string): string {
    const url = !!redirectTo ? decodeURI(redirectTo) : '/';
    return url.includes(LOGIN_PATH) ? '/' : url;
  }

  private firebaseUserToUserDTO(firebaseUser: FirebaseUser): WithUid<UserDTO> {
    if (!firebaseUser || !firebaseUser.email || !firebaseUser.displayName || !firebaseUser.photoURL) {
      throw new Error(`One or more required properties are missing in Firebase user object: ${JSON.stringify(firebaseUser)}`);
    }
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoUrl: firebaseUser.photoURL,
    };
  }
}
