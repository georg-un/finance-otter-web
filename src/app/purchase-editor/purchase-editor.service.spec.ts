import { TestBed } from '@angular/core/testing';

import { PurchaseEditorService } from './purchase-editor.service';

describe('PurchaseEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseEditorService = TestBed.get(PurchaseEditorService);
    expect(service).toBeTruthy();
  });
});
