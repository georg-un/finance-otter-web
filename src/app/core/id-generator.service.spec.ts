import { TestBed } from '@angular/core/testing';

import { IdGeneratorService } from './id-generator.service';
import { TestingModule } from './testing/testing.module';
import { of } from 'rxjs';
import stringMatching = jasmine.stringMatching;
import { AUTH_TOKEN_KEY_ID } from '../mock/auth-service.mock';
import { AuthService } from '@auth0/auth0-angular';

describe('IdGeneratorService', () => {

  let auth: AuthService;
  let service: IdGeneratorService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));

  beforeEach(() => {
    auth = TestBed.inject(AuthService);
    service = TestBed.inject(IdGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate the purchase id', () => {
    service.generatePurchaseId().subscribe(id => {
      expect(id.length).toEqual(AUTH_TOKEN_KEY_ID.length + new Date().getTime().toString().length + 6);
      expect(id).toEqual(stringMatching('^(.*?)\.00'));
      expect(id).toEqual(stringMatching('P.(.*?)'));
    });
  });

  it('should return undefined without key id', () => {
    spyOn(auth, 'getAccessTokenSilently').and.returnValue(of(undefined));
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

  it('should throw an error on a negative debit index', () => {
    expect(() => service.generateDebitId('P.mock.0000.00', -2)).toThrow();
  });

  it('should throw an Error on a debit index > 99', () => {
    expect(() => service.generateDebitId('P.mock.0000.00', 100)).toThrow();
  });

  it('should throw an Error without a purchase id', () => {
    expect(() => service.generateDebitId(undefined, 2)).toThrow();
  });

  it('should throw an Error if the debit index is nil', () => {
    expect(() => service.generateDebitId('P.mock.0000.00', undefined)).toThrow();
    expect(() => service.generateDebitId('P.mock.0000.00', null)).toThrow();
  });
});
