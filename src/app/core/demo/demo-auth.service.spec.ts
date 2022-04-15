import { TestBed } from '@angular/core/testing';

import { DemoAuthService } from './demo-auth.service';

describe('DemoAuthService', () => {
  let service: DemoAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
