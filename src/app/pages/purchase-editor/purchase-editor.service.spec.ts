import { TestBed } from '@angular/core/testing';

import { PurchaseEditorService } from './purchase-editor.service';
import { TestingModule } from '../../core/testing/testing.module';

describe('PurchaseEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));

  it('should be created', () => {
    const service: PurchaseEditorService = TestBed.get(PurchaseEditorService);
    expect(service).toBeTruthy();
  });
});
