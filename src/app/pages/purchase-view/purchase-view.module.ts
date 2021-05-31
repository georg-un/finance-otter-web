import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseViewComponent } from './purchase-view.component';
import { DebitCardModule } from '../../shared/debit-card/debit-card.module';
import { DynamicDialogComponent } from '../../shared/dynamic-dialog/dynamic-dialog.component';
import { ShortNamePipeModule } from '../../shared/short-name-pipe/short-name-pipe.module';
import { SyncIndicatorModule } from '../../shared/sync-indicator/sync-indicator.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

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
