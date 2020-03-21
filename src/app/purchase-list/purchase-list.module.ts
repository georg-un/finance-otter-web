import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase-list.component';
import { PurchaseCardComponent } from './purchase-card/purchase-card.component';
import { MatCardModule, MatIconModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';

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
  ]
})
export class PurchaseListModule { }
