import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { addQueryParam } from '../../utils/router-utils';
import { RECEIPT_NAME_PATH_PARAM } from '../../../../../domain/receipt-api-models';

export const RECEIPT_NAME_QUERY_PARAM = 'receiptName';

@Injectable()
export class ReceiptBehaviorService {

  /**
   * Current receipt name
   */
  receiptName?: string;

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Get the receipt name from the URL query param
    this.activatedRoute.queryParamMap.pipe(
      map((paramMap) => paramMap.get(RECEIPT_NAME_QUERY_PARAM)),
      filter(Boolean),
    ).subscribe((receiptName) => {
      this.receiptName = receiptName;
    });
  }

  /**
   * Sync receipt name changes to the URL query param
   * @param receiptName
   */
  receiptNameChange(receiptName: string | undefined) {
    if (receiptName !== this.receiptName) {
      addQueryParam(this.router, this.activatedRoute, {
        [RECEIPT_NAME_PATH_PARAM]: receiptName ? receiptName : null  // null removes the query param
      });
    }
  }
}
