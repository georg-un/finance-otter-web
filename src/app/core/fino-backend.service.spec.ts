import { TestBed } from '@angular/core/testing';

import { FinoBackendService } from './fino-backend.service';

describe('FinoBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinoBackendService = TestBed.get(FinoBackendService);
    expect(service).toBeTruthy();
  });
});
