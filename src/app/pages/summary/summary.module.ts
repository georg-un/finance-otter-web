import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { DebitCardModule } from "../../shared/debit-card/debit-card.module";
import { BarChartModule, PieChartModule } from "@swimlane/ngx-charts";
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
