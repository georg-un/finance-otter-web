import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase-list.component';
import { PurchaseCardComponent } from './purchase-card/purchase-card.component';
import { MatCardModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SyncIndicatorModule } from '../../shared/sync-indicator/sync-indicator.module';

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
  ]
})
export class PurchaseListModule { }
