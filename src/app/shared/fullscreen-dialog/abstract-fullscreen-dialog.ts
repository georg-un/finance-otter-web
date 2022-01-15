import { EventEmitter, Output } from '@angular/core';
import { DestroyableComponent } from '../destroyable.component';

export abstract class AbstractFullscreenDialog extends DestroyableComponent {

  @Output() close: EventEmitter<void> = new EventEmitter();

  onCloseButtonClick() {
    this.close.emit();
  }

}
