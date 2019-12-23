import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentViewComponent } from './payment-view.component';
import { DebitCardComponent } from './debit-card/debit-card.component';
import { MatButtonModule, MatCardModule, MatIconModule } from "@angular/material";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    PaymentViewComponent,
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
export class PaymentViewModule { }
