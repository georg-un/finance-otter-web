import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { fadeOnChange } from '../layout.animations';
import { HeaderButtonConfig } from '../../shared/domain/header-config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeOnChange]
})
export class HeaderComponent implements OnDestroy {

  @Input() leftButton: HeaderButtonConfig;

  @Input() rightButton: HeaderButtonConfig;

  @Input() showLogo: boolean;

  @Output() leftButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  @Output() rightButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  private onDestroy$: Subject<boolean> = new Subject();

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onLeftButtonClick(): void {
    this.leftButtonClicked.emit();
  }

  onRightButtonClick(): void {
    this.rightButtonClicked.emit();
  }

}
