import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { DebitCardModule } from "../../shared/debit-card/debit-card.module";
import { BarChartModule, PieChartModule } from "@swimlane/ngx-charts";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    DebitCardModule,
    PieChartModule,
    BarChartModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class SummaryModule { }
