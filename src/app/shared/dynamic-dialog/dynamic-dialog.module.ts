import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogComponent } from './dynamic-dialog.component';
import { MatButtonModule, MatDialogModule } from '@angular/material';



@NgModule({
  declarations: [
    DynamicDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class DynamicDialogModule { }
