import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appDestroyable]',
  standalone: true
})
export class Destroyable implements OnDestroy {
  private onDestroy = new Subject<void>();

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  get onDestroy$() {
    return this.onDestroy.asObservable();
  }
}
