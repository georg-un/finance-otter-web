import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultilineSnackbarComponent } from './multiline-snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    MultilineSnackbarComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule
  ]
})
export class MultilineSnackbarModule { }
