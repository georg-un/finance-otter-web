import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase-list.component';
import { PurchaseCardComponent } from './purchase-card/purchase-card.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SyncIndicatorModule } from '../../shared/sync-indicator/sync-indicator.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddPurchaseDialogModule } from '../../shared/add-purchase-dialog/add-purchase-dialog.module';

@NgModule({
  declarations: [
    PurchaseListComponent,
    PurchaseCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    SyncIndicatorModule,
    AddPurchaseDialogModule
  ]
})
export class PurchaseListModule { }
