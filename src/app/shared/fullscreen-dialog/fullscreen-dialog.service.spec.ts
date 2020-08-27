import { TestBed } from '@angular/core/testing';

import { FullscreenDialogService } from './fullscreen-dialog.service';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';

describe('FullscreenDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule,
      MaterialTestingModule
    ]
  }));

  it('should be created', () => {
    const service: FullscreenDialogService = TestBed.get(FullscreenDialogService);
    expect(service).toBeTruthy();
  });
});
