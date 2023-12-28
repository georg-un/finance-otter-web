import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseDTO } from '../../../../domain';
import { map, Observable } from 'rxjs';
import { RECEIPT_API_URLS, ReceiptApiResponse } from '../../../../domain/receipt-api-models';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  constructor(
    private http: HttpClient,
  ) {
  }

  uploadReceipt(receipt: unknown): Observable<string> {  // TODO: type correctly
    return this.http.post<ReceiptApiResponse['Create']>(RECEIPT_API_URLS.CREATE.get(), receipt).pipe(
      map((response) => response.name)
    );
  }

  getReceipt(receiptName: string): Observable<Buffer> {
    return this.http.get<ReceiptApiResponse['Read']>(RECEIPT_API_URLS.READ.get(receiptName));
  }

  replaceReceipt(receiptName: string, newReceipt: PurchaseDTO) {  // TODO: type correctly
    return this.http.put<ReceiptApiResponse['Update']>(RECEIPT_API_URLS.UPDATE.get(receiptName), newReceipt);
  }

  deleteReceipt(receiptName: string) {
    return this.http.delete<ReceiptApiResponse['Delete']>(RECEIPT_API_URLS.DELETE.get(receiptName));
  }
}
