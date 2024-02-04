import { TestBed } from '@angular/core/testing';

import { PurchaseFormBehaviorService } from './purchase-form-behavior.service';

describe('PurchaseFormBehaviorService', () => {
  let service: PurchaseFormBehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseFormBehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
