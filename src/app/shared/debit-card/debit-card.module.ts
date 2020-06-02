import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebitCardComponent } from './debit-card.component';
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material';

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
    MatCardModule
  ]
})
export class DebitCardModule { }
