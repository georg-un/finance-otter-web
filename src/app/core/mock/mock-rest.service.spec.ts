import { async, TestBed } from '@angular/core/testing';

import { MockRestService } from './mock-rest.service';

describe('MockRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockRestService = TestBed.get(MockRestService);
    expect(service).toBeTruthy();
  });

});
