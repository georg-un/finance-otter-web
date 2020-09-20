import { TestBed } from '@angular/core/testing';

import { IdGeneratorService } from './id-generator.service';
import { TestingModule } from './testing/testing.module';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import stringMatching = jasmine.stringMatching;

describe('IdGeneratorService', () => {

  let auth: AuthService;
  let service: IdGeneratorService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));

  beforeEach(() => {
    auth = TestBed.get(AuthService);
    service = TestBed.get(IdGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate the purchase id', () => {
    const keyId = 'mock';
    spyOn(auth, 'getKeyId').and.returnValue(of(keyId));
    service.generatePurchaseId().subscribe(id => {
      expect(id.length).toEqual(keyId.length + new Date().getTime().toString().length + 6);
      expect(id).toEqual(stringMatching('^(.*?)\.00'));
      expect(id).toEqual(stringMatching('P.(.*?)'));
    });
  });

  it('should return undefined without key id', () => {
    spyOn(auth, 'getKeyId').and.returnValue(of(undefined));
    service.generatePurchaseId().subscribe(id => {
      expect(id).toBeUndefined();
    });
  });

  it('should generate a debit with a single-digit debit index', () => {
    const debitId = service.generateDebitId('P.mock.0000.00', 3);
    expect(debitId).toEqual('D.mock.0000.03');
  });

  it('should generate a debit with a double-digit debit index', () => {
    const debitId = service.generateDebitId('P.mock.0000.00', 20);
    expect(debitId).toEqual('D.mock.0000.20');
  });

  it('should return undefined on a negative debit index', () => {
    const spy = spyOn(console, 'error').and.stub();
    const debitId = service.generateDebitId('P.mock.0000.00', -2);
    expect(debitId).toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should return undefined on a debit index > 99', () => {
    const spy = spyOn(console, 'error').and.stub();
    const debitId = service.generateDebitId('P.mock.0000.00', 100);
    expect(debitId).toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should return undefined without a purchase id', () => {
    const spy = spyOn(console, 'error').and.stub();
    const debitId = service.generateDebitId(undefined, 2);
    expect(debitId).toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should return undefined if debit index is nil', () => {
    const spy = spyOn(console, 'error').and.stub();
    let debitId = service.generateDebitId('P.mock.0000.00', undefined);
    expect(debitId).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
    debitId = service.generateDebitId('P.mock.0000.00', null);
    expect(debitId).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
