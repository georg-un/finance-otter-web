import { TestBed } from '@angular/core/testing';

import { TabBehaviorService } from './tab-behavior.service';

describe('TabBehaviorService', () => {
  let service: TabBehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabBehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
