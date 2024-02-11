import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { addQueryParam } from '../../utils/router-utils';

export const RECEIPT_SRC_QUERY_PARAM = 'receiptSrc';

@Injectable()
export class ReceiptBehaviorService {

  /**
   * Current receipt name
   */
  receiptSrc?: string;

  /**
   * Whether the receipt has been changed.
   */
  receiptChanged = false;

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Get the receipt name from the URL query param
    this.activatedRoute.queryParamMap.pipe(
      map((paramMap) => paramMap.get(RECEIPT_SRC_QUERY_PARAM)),
      map((receiptName) => receiptName ?? undefined),  // replace null by undefined for easier typing
    ).subscribe((receiptName) => {
      this.receiptSrc = receiptName;
    });
  }

  /**
   * Sync receipt name changes to the URL query param
   * @param receiptSrc
   */
  receiptSrcChange(receiptSrc: string | undefined) {
    if (receiptSrc !== this.receiptSrc) {
      this.receiptChanged = true;
      addQueryParam(this.router, this.activatedRoute, {
        [RECEIPT_SRC_QUERY_PARAM]: receiptSrc ? receiptSrc : null  // null removes the query param
      });
    }
  }
}
