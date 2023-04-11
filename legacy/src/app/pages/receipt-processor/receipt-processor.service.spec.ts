import { TestBed } from '@angular/core/testing';

import { ReceiptProcessorService } from './receipt-processor.service';
import { TestingModule } from '../../core/testing/testing.module';

describe('ReceiptProcessorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));

  it('should be created', () => {
    const service: ReceiptProcessorService = TestBed.get(ReceiptProcessorService);
    expect(service).toBeTruthy();
  });
});
