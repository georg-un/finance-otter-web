import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentEditorComponent } from "./payment-editor.component";
import { FormsModule } from "@angular/forms";
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
} from "@angular/material";

@NgModule({
  declarations: [
    PaymentEditorComponent
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
