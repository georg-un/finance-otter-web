import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SyncStatusEnum } from '../../core/entity/purchase';

@Component({
  selector: 'app-sync-indicator',
  templateUrl: './sync-indicator.component.html',
  styleUrls: ['./sync-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SyncIndicatorComponent implements OnInit, OnChanges {

  @Input()
  public syncStatus: SyncStatusEnum;
  @Input()
  public size: string;

  public icon: string;

  public colorClass: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.setIcon();
  }

  public ngOnChanges(_: SimpleChanges): void {
    this.setIcon();
  }

  private setIcon(): void {
    switch (this.syncStatus) {
      case SyncStatusEnum.Remote:
        this.icon = 'done';
        this.colorClass = 'success';
        break;
      case SyncStatusEnum.Syncing:
        this.icon = 'sync';
        this.colorClass = 'process';
        break;
      case SyncStatusEnum.Error:
        this.icon = 'sync_problem';
        this.colorClass = 'error';
        break;
    }
    this.changeDetectorRef.markForCheck();
  }

}
