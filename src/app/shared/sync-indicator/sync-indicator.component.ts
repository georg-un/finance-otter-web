import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SyncStatusEnum } from '../../core/entity/purchase';

@Component({
  selector: 'app-sync-indicator',
  templateUrl: './sync-indicator.component.html',
  styleUrls: ['./sync-indicator.component.scss']
})
export class SyncIndicatorComponent implements OnInit, OnChanges {

  @Input() syncStatus: SyncStatusEnum;
  @Input() size: string;
  icon: string;
  colorClass: string;

  constructor() { }

  ngOnInit() {
    this.setIcon();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setIcon();
  }

  private setIcon() {
    switch (this.syncStatus) {
      case SyncStatusEnum.Remote:
        this.icon = 'done';
        this.colorClass = 'success';
        break;
      case SyncStatusEnum.Syncing:
        this.icon = 'sync';
        this.colorClass = 'process';
        break;
      case SyncStatusEnum.Local:
      case SyncStatusEnum.LocalUpdate:
      case SyncStatusEnum.LocalDelete:
        this.icon = 'sync_problem';
        this.colorClass = 'error';
        break;
    }
  }

}
