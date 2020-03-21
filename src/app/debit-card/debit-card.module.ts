import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebitCardComponent } from './debit-card.component';
import { MatButtonModule, MatCardModule, MatIconModule } from "@angular/material";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    DebitCardComponent
  ],
  exports: [
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
export class DebitCardModule { }
