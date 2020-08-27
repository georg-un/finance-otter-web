import { TestBed } from '@angular/core/testing';

import { InterceptorService } from './interceptor.service';
import { TestingModule } from './testing/testing.module';

describe('InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));

  it('should be created', () => {
    const service: InterceptorService = TestBed.get(InterceptorService);
    expect(service).toBeTruthy();
  });
});
