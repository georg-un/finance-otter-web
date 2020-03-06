import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {

  constructor(private auth: AuthService
  ) {
  }

  generatePurchaseId(): Observable<string> {
    return this.auth.getKeyId().pipe(
      map((kid) => `P.${kid}.${new Date().getTime().toString()}.00`)
    );
  }

  generateDebitId(purchaseId: string, debitIndex: number): string {
    if (!purchaseId || debitIndex === null || debitIndex === undefined) {
      console.error(`Unable to generate debit ID with purchaseID: ${purchaseId} and debitIndex: ${debitIndex}`);
      return undefined;
    }
    if (debitIndex < 0 || debitIndex > 99) {
      console.error(`Debit index must be between 0 and 99 but was ${debitIndex}`);
      return undefined;
    }
    // Add a 0 at the beginning of the debit-index if it has only one digit
    return debitIndex < 10 ?
      `D.${purchaseId.substring(1, purchaseId.length - 3)}.0${debitIndex}` :
      `D.${purchaseId.substring(1, purchaseId.length - 3)}.${debitIndex}`;
  }

}
