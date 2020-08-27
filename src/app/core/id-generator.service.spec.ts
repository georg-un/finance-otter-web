import { TestBed } from '@angular/core/testing';

import { IdGeneratorService } from './id-generator.service';
import { TestingModule } from './testing/testing.module';

describe('IdGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));

  it('should be created', () => {
    const service: IdGeneratorService = TestBed.get(IdGeneratorService);
    expect(service).toBeTruthy();
  });
});
