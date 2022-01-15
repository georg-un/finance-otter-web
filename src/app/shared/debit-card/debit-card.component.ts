import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../core/entity/user';

@Component({
  selector: 'app-debit-card',
  templateUrl: './debit-card.component.html',
  styleUrls: ['./debit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebitCardComponent implements OnChanges {

  @Input() amount: number;
  @Input() user: User;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnChanges(_: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }
}
