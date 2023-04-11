import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPurchaseDialogComponent } from './add-purchase-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageInputComponent } from './image-input/image-input.component';
import { AddReceiptDialog } from './add-receipt-dialog.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AddReceiptDialog,
    AddPurchaseDialogComponent,
    ImageInputComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [
    AddReceiptDialog,
    AddPurchaseDialogComponent
  ],
  entryComponents: [
    AddReceiptDialog,
    AddPurchaseDialogComponent,
  ]
})
export class AddPurchaseDialogModule {
}
