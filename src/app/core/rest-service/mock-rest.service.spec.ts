import { TestBed } from '@angular/core/testing';

import { MockRestService } from './mock-rest.service';

describe('MockRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockRestService = TestBed.get(MockRestService);
    expect(service).toBeTruthy();
  });

  it('should load mocked payment1', () => {
    const service: MockRestService = TestBed.get(MockRestService);
    expect(service.fetchPayment(1).transaction.username).toBe('alice');
    expect(service.fetchPayment(1).debits[0].debtorName).toBe('bob');
  });

  it('should load mocked transaction1', () => {
    const service: MockRestService = TestBed.get(MockRestService);
    expect(service.fetchTransaction(1).username).toBe('alice');
  });

  it('should load mocked transactions', () => {
    const service: MockRestService = TestBed.get(MockRestService);
    expect(service.fetchTransactions().length).toBe(3);
    expect(service.fetchTransactions()[0].username).toBe('alice');
  });

  it('should load mocked users', () => {
    const service: MockRestService = TestBed.get(MockRestService);
    expect(service.fetchUsers().length).toBe(3);
    expect(service.fetchUsers()[0].username).toBe('alice');
  });

});
