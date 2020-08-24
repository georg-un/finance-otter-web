import { TestBed } from '@angular/core/testing';

import { FinOBackendService } from './fino-backend.service';

describe('FinOBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinOBackendService = TestBed.get(FinOBackendService);
    expect(service).toBeTruthy();
  });
});
