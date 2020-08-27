import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { TestingModule } from './testing/testing.module';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
