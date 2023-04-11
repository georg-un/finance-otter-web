import { TestBed } from '@angular/core/testing';

import { IdGeneratorService } from './id-generator.service';
import { TestingModule } from './testing/testing.module';
import { EMPTY, of } from 'rxjs';
import stringMatching = jasmine.stringMatching;
import { AUTH_TOKEN_KEY_ID } from '../mock/auth-service.mock';
import { AuthService } from '@auth0/auth0-angular';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

// JWT without a key-id
const AUTH_TOKEN_WITHOUT_KID = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL25pY2UtdHJ5LmNvbS8iLCJzdWIiOiJhc2RmYWRmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2QiLCJhdWQiOlsiaHR0cHM6Ly9uaWNlLXRyeS5jb20iXSwiaWF0IjoxNjQ4MzE1MDkwLCJleHAiOjE2NDg0MDE0OTAsImF6cCI6InF3ZXJ0enVpb3Bhc2RmZ2hqa2x5eGN2Ym5tMTIzNDU2Iiwic2NvcGUiOiJvdHRlciBicmVlZGluZyJ9.WyfGtefZP9gt2cXzolDg8qElTfHyk24kMcJphx3cQuBCBsBlb2fZ2nZy30Id-TmdjyxBqPWfTS4a2cR1CAjyVZP2BrNh6pNUHCZIVUgEgl13w8EdOBXdW810VQTtoAmWV-jk6L9CfjTbvDFNerrMm4zB6_YzFJ77Q2k9BxLjA_KxNVY92NpIqdKTstIKiXjSuIUwPFP1OY8lpoLtk6Kh7oBGJkcO6xu8PtOMlmIKYqtDqWcNT2e524eKz5EnShg9TnDLVe5FrGAem_72mfrIXhCK7Z-tzcoenXsJ7MQyxdfMPvz2dZ6MBJV2MF5eKv1ylGE_N7u81tBkKHwG87JshQ';

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
    spyOn(service, '_getKeyIdFromAccessToken').and.returnValue(of(undefined));
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

  it('should get the key-id from an access token', (done: DoneFn) => {
    service._getKeyIdFromAccessToken().subscribe(keyId => {
      expect(keyId).toEqual(AUTH_TOKEN_KEY_ID);
      done();
    });
  });

  it('should throw an error on a falsy token', (done: DoneFn) => {
    spyOn(auth, 'getAccessTokenSilently').and.returnValue(of(null));
    service._getKeyIdFromAccessToken().pipe(
      catchError(err => {
        expect(err.message.startsWith('Did not receive')).toBeTrue();
        done();
        return EMPTY;
      })
    ).subscribe();
  });

  it('should throw an error if the token is no valid JWT', (done: DoneFn) => {
    spyOn(auth, 'getAccessTokenSilently').and.returnValue(of('asdf.1234'));
    service._getKeyIdFromAccessToken().pipe(
      catchError(err => {
        expect(err.message.startsWith('The inspected token')).toBeTrue();
        done();
        return EMPTY;
      })
    ).subscribe();
  });

  it('should throw an error if it cannot decode the JWT', (done: DoneFn) => {
    spyOn(auth, 'getAccessTokenSilently').and.returnValue(of('ASDF.asdf.1234'));
    service['jwtHelper'] = { urlBase64Decode: (_: string): string => undefined } as JwtHelperService;
    service._getKeyIdFromAccessToken().pipe(
      catchError(err => {
        expect(err.message.startsWith('Cannot decode')).toBeTrue();
        done();
        return EMPTY;
      })
    ).subscribe();
  });

  it('should throw an error if the JWT has no key id', (done: DoneFn) => {
    spyOn(auth, 'getAccessTokenSilently').and.returnValue(of(AUTH_TOKEN_WITHOUT_KID));
    service._getKeyIdFromAccessToken().pipe(
      catchError(err => {
        expect(err.message.startsWith('Header did not contain')).toBeTrue();
        done();
        return EMPTY;
      })
    ).subscribe();
  });
});
