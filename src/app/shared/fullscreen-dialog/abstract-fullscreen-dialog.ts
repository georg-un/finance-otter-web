import { EventEmitter, Output } from '@angular/core';

export abstract class AbstractFullscreenDialog {

  @Output() close: EventEmitter<void> = new EventEmitter();

  onCloseButtonClick() {
    this.close.emit();
  }

}
