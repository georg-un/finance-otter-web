import { TestBed } from '@angular/core/testing';

import { FullscreenDialogService } from './fullscreen-dialog.service';

describe('FullscreenDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FullscreenDialogService = TestBed.get(FullscreenDialogService);
    expect(service).toBeTruthy();
  });
});
