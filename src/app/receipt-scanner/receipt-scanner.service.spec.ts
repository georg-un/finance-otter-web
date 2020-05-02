import { TestBed } from '@angular/core/testing';

import { ReceiptScannerService } from './receipt-scanner.service';

describe('ReceiptScannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceiptScannerService = TestBed.get(ReceiptScannerService);
    expect(service).toBeTruthy();
  });
});
