import { TestBed } from '@angular/core/testing';

import { FinOBackendService } from './fino-backend.service';
import { TestingModule } from './testing/testing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialTestingModule } from './testing/material-testing.module';

describe('FinOBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule,
      MaterialTestingModule,
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: FinOBackendService = TestBed.get(FinOBackendService);
    expect(service).toBeTruthy();
  });
});
