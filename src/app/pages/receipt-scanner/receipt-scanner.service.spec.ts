import { TestBed } from '@angular/core/testing';

import { ReceiptScannerService } from './receipt-scanner.service';
import { TestingModule } from '../../core/testing/testing.module';

describe('ReceiptScannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));

  it('should be created', () => {
    const service: ReceiptScannerService = TestBed.get(ReceiptScannerService);
    expect(service).toBeTruthy();
  });
});
