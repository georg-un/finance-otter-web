import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseEditorNewComponent } from './purchase-editor-new.component';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule, MatNativeDateModule,
  MatSelectModule,
  MatSlideToggleModule
} from '@angular/material';
import { PurchaseEditorEditComponent } from './purchase-editor-edit.component';
import { QrScannerComponent } from '../qr-scanner/qr-scanner.component';
import { QrScannerModule } from '../qr-scanner/qr-scanner.module';


@NgModule({
  declarations: [
    PurchaseEditorNewComponent,
    PurchaseEditorEditComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    QrScannerModule
  ],
  entryComponents: [
    QrScannerComponent
  ]
})
export class PurchaseEditorModule { }
