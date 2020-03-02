import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseViewComponent } from './purchase-view.component';
import { DebitCardComponent } from './debit-card/debit-card.component';
import { MatButtonModule, MatCardModule, MatIconModule } from "@angular/material";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    PurchaseViewComponent,
    DebitCardComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SharedModule
  ]
})
export class PurchaseViewModule { }
