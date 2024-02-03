import { TestBed } from '@angular/core/testing';

import { ReceiptBehaviorService } from './receipt-behavior.service';

describe('ReceiptBehaviorService', () => {
  let service: ReceiptBehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptBehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
