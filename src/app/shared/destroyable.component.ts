import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class DestroyableComponent implements OnDestroy {

  protected readonly onDestroy$: Subject<void> = new Subject<void>();

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
