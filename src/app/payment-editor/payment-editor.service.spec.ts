import { TestBed } from '@angular/core/testing';

import { PaymentEditorService } from './payment-editor.service';

describe('PaymentEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentEditorService = TestBed.get(PaymentEditorService);
    expect(service).toBeTruthy();
  });
});
