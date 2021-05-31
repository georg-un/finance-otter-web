import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptViewComponent } from './receipt-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';



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
