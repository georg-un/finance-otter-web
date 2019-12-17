import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentEditorNewComponent } from './payment-editor-new.component';
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
import { PaymentEditorEditComponent } from './payment-editor-edit.component';

@NgModule({
  declarations: [
    PaymentEditorNewComponent,
    PaymentEditorEditComponent
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
    MatButtonModule
  ]
})
export class PaymentEditorModule { }
