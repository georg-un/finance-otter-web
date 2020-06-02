import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptViewComponent } from './receipt-view.component';
import { MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material';



@NgModule({
  declarations: [
    ReceiptViewComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ]
})
export class ReceiptViewModule { }
