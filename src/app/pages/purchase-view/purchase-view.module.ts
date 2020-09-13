import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseViewComponent } from './purchase-view.component';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { DebitCardModule } from '../../shared/debit-card/debit-card.module';
import { DynamicDialogComponent } from '../../shared/dynamic-dialog/dynamic-dialog.component';
import { ShortNamePipeModule } from '../../shared/short-name-pipe/short-name-pipe.module';
import { SyncIndicatorModule } from '../../shared/sync-indicator/sync-indicator.module';

@NgModule({
  declarations: [
    PurchaseViewComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    DebitCardModule,
    MatDialogModule,
    MatTooltipModule,
    ShortNamePipeModule,
    SyncIndicatorModule,
  ],
  entryComponents: [
    DynamicDialogComponent
  ]
})
export class PurchaseViewModule { }
