import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentViewComponent } from "./payment-view.component";
import { DebitCardComponent } from "./debit-card/debit-card.component";

@NgModule({
  declarations: [
    PaymentViewComponent,
    DebitCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PaymentViewModule { }
