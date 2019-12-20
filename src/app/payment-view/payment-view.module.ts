import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentViewComponent } from './payment-view.component';
import { DebitCardComponent } from './debit-card/debit-card.component';
import { MatButtonModule, MatIconModule } from "@angular/material";

@NgModule({
  declarations: [
    PaymentViewComponent,
    DebitCardComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class PaymentViewModule { }
