import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase-list.component';
import { PurchaseCardComponent } from './purchase-card/purchase-card.component';
import { MatCardModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    PurchaseListComponent,
    PurchaseCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    SharedModule,
    MatIconModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
  ]
})
export class PurchaseListModule { }
