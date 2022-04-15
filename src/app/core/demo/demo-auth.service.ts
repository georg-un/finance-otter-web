import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {User as Auth0User} from '@auth0/auth0-angular';

// created with https://dinochiesa.github.io/jwt/
const DEMO_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFXRVJUWlVJT1BBU0RGR0hKS0xZWENWQk5NcXdlcnR6dWlvcGFzZGZnaGprbHl4Y3Zibm0xMiJ9.eyJpc3MiOiJodHRwczovL25pY2UtdHJ5LmNvbS8iLCJzdWIiOiJ1c2VyNCIsImF1ZCI6WyJodHRwczovL25pY2UtdHJ5LmNvbSJdLCJpYXQiOjE2NDgzMTUwOTAsImV4cCI6MTY0ODQwMTQ5MCwiYXpwIjoicXdlcnR6dWlvcGFzZGZnaGprbHl4Y3Zibm0xMjM0NTYiLCJzY29wZSI6Im90dGVyIGJyZWVkaW5nIn0.UupiKVjheVBg2OePKi9Z_ub90_6d5QH0omMJhnzt15p_QQNpgQEQw6qFM45zx1Fjxis_dxCi_Gk9THWu6U9uwP9zEVRQkOQdBlGeyFZYvQa3ugUJt4g29PrZzgC8tTXRR5OL0hFXCwUKCYGNsobWUr1zUGmLrsNvT2WBf7D5OvvpMTIbsr-8vMGQ08VJPhUqvdmqw6--HRVz8dDxi1FxAJChgY59Up2jJ8F0Jq__r8JuFmXR9ySdZ5CDa3zHHVGzn00JfEZq92ECwxRK7tu6R3m0T17IHJLCeZnHTaS_w-kTU8kbkVw7ue4UCkmG_xrGGGX3p5MF5N5ScGvHrO-3qQ';

@Injectable({
  providedIn: 'root'
})
export class DemoAuthService {

  public isAuthenticated$: Observable<boolean> = of(true);

  public user$: Observable<Auth0User> = of({sub: 'user4'} as Auth0User);

  public getAccessTokenSilently(_?: any): Observable<string> {
    return of(DEMO_ACCESS_TOKEN);
  }

  public loginWithRedirect(_?: any): Observable<void> {
    return of();
  }

  public logout(_?: any): void {
    location.reload();
  }
}
