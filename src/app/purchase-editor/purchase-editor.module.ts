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
  ]
})
export class PurchaseEditorModule { }
