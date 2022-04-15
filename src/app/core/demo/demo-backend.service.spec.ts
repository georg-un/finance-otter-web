import { TestBed } from '@angular/core/testing';

import { DemoBackendService } from './demo-backend.service';

describe('DemoBackendService', () => {
  let service: DemoBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
