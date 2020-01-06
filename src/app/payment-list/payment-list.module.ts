import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentListComponent } from './payment-list.component';
import { PaymentCardComponent } from './payment-card/payment-card.component';
import { MatCardModule } from '@angular/material';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    PaymentListComponent,
    PaymentCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    SharedModule,
  ]
})
export class PaymentListModule { }
