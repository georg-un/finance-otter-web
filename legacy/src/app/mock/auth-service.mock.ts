import { AuthService } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';

const _AUTH_USER_MOCK = {
  "nickname": "fancy.otter",
  "name": "fancy@finance-otter.com",
  "picture": "assets/otter-icon-128.png",
  "updated_at": "2022-03-26T16:59:09.925Z",
  "email": "fancy@finance-otter.com",
  "email_verified": true,
  "sub": "qwertzuiopasdfghjklyxcvbnm1234"
}

const _AUTH_TOKEN_MOCK = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFXRVJUWlVJT1BBU0RGR0hKS0xZWENWQk5NcXdlcnR6dWlvcGFzZGZnaGprbHl4Y3Zibm0xMiJ9.eyJpc3MiOiJodHRwczovL25pY2UtdHJ5LmNvbS8iLCJzdWIiOiJhc2RmYWRmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2QiLCJhdWQiOlsiaHR0cHM6Ly9uaWNlLXRyeS5jb20iXSwiaWF0IjoxNjQ4MzE1MDkwLCJleHAiOjE2NDg0MDE0OTAsImF6cCI6InF3ZXJ0enVpb3Bhc2RmZ2hqa2x5eGN2Ym5tMTIzNDU2Iiwic2NvcGUiOiJvdHRlciBicmVlZGluZyJ9.YagbRfdNU186uVG_vA3Sp4VJD4diKnN9DGRmAO0YyTMx6fRAWaYlTXWKwsJXu6h4KZiRuh19dAdJ-lots9xKYiS1Sf5z9m6ppGQH7GbIJQffpb1Ijd0OvuClHv8HU0VtDkU4kXe97gIIkYHess7p7az0yVSvhoUZw-6gvy5LyI0uTpx6kxtOqpkcBj7RXKqsXcIlwE1YdJiqu0RO1a-7r3LtlfIvS1-HT_he9ZZXMjcl-33dhWuUKj3BatKLEPGmQL3bNi_K-Ua02GcMue5Q6omcQ9TBMf7p91-V3vJlwBemOvaQdKYyZGdC2zV-m-eUR4gYlL9c5TUXeQQSRNjWQQ'
// key-id used in the auth-token mock
export const AUTH_TOKEN_KEY_ID = 'QWERTZUIOPASDFGHJKLYXCVBNMqwertzuiopasdfghjklyxcvbnm12';

export class AuthServiceMock implements Partial<AuthService> {

  public user$ = of(_AUTH_USER_MOCK);

  public getAccessTokenSilently(_: any): Observable<any> {
    return of(_AUTH_TOKEN_MOCK);
  }

  public logout(_?: any): void {
    return;
  }
}
