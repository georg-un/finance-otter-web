import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {

  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private auth: AuthService,
  ) {
  }

  public generatePurchaseId(): Observable<string> {
    return this._getKeyIdFromAccessToken().pipe(
      map(kid => kid ? `P.${kid}.${new Date().getTime().toString()}.00` : undefined)
    );
  }

  public generateDebitId(purchaseId: string, debitIndex: number): string {
    if (!purchaseId || debitIndex === null || debitIndex === undefined) {
      throw new Error(`Unable to generate debit ID with purchaseID: ${purchaseId} and debitIndex: ${debitIndex}`)
    }
    if (debitIndex < 0 || debitIndex > 99) {
      throw new Error(`Debit index must be between 0 and 99 but was ${debitIndex}`);
    }
    // Add a 0 at the beginning of the debit-index if it has only one digit
    return debitIndex < 10 ?
      `D.${purchaseId.substring(2, purchaseId.length - 3)}.0${debitIndex}` :
      `D.${purchaseId.substring(2, purchaseId.length - 3)}.${debitIndex}`;
  }

  public _getKeyIdFromAccessToken(): Observable<string> {
    return this.auth.getAccessTokenSilently().pipe(
      take(1),
      map((token: string) => {
        // see https://github.com/auth0/angular2-jwt/blob/master/projects/angular-jwt/src/lib/jwthelper.service.ts
        if (!token) {
          throw new Error('Did not receive a token.');
        }
        // Split token into header, payload & signature
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error(
            'The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.'
          );
        }
        // Decode the header
        const decoded = this.jwtHelper.urlBase64Decode(parts[0]);
        if (!decoded) {
          throw new Error('Cannot decode the token.');
        }
        // Check if the header contains the KID and return it
        const header = JSON.parse(decoded);
        if (!header.hasOwnProperty('kid')) {
          throw new Error('Header did not contain a key ID.');
        } else {
          return header.kid;
        }
      })
    );
  }
}
