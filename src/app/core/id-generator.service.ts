import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {

  constructor(
    private auth: AuthService,
  ) {
  }

  public generatePurchaseId(): Observable<string> {
    return this.auth.getKeyId().pipe(
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
}
