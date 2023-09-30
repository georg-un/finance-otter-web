import { Observable, Subject, take } from 'rxjs';

/**
 * Executes an Observable once immediately without the need for a subscriber.
 * @param observable    The Observable to execute once immediately
 */
export function runObservableOnceNow<T>(observable: Observable<T>): Observable<T> {
  const result = new Subject<T>();
  observable.pipe(take(1)).subscribe(result);
  return result.asObservable();
}
