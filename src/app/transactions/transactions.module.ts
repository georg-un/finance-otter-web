import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { TransactionCardComponent } from './transaction-card/transaction-card.component';
import { MatCardModule } from '@angular/material';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    SharedModule,
  ]
})
export class TransactionsModule { }
