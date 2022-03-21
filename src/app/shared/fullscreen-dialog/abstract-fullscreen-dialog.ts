import { EventEmitter, Output } from '@angular/core';
import { Destroyable } from '../destroyable';

export abstract class AbstractFullscreenDialog extends Destroyable {

  @Output() close: EventEmitter<void> = new EventEmitter();

  onCloseButtonClick() {
    this.close.emit();
  }

}
