import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { MatCardModule } from '@angular/material';
import { DebitCardModule } from "../debit-card/debit-card.module";

@NgModule({
  declarations: [
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    DebitCardModule
  ]
})
export class SummaryModule { }
