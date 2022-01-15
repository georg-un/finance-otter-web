import { Observable, of } from 'rxjs';

export const AUTH_SERVICE_MOCK = {
  getKeyId: (): Observable<string> => of('1234567890QWERTZUIOPASDFGHJKLYXCVBNMqwertzuiopasdfghjk')
};
