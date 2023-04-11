import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeOnChange } from '../layout.animations';
import { HeaderButtonConfig } from '../../shared/domain/header-config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeOnChange]
})
export class HeaderComponent {

  @Input() leftButton: HeaderButtonConfig;

  @Input() rightButton: HeaderButtonConfig;

  @Input() showLogo: boolean;

  @Output() leftButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  @Output() rightButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  onLeftButtonClick(): void {
    this.leftButtonClicked.emit();
  }

  onRightButtonClick(): void {
    this.rightButtonClicked.emit();
  }

}
