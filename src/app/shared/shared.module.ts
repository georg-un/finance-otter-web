import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortNamePipe } from "./short-name.pipe";
import { SyncIndicatorComponent } from './sync-indicator/sync-indicator.component';
import { MatIconModule, MatSnackBarModule } from '@angular/material';
import { MultilineSnackbarComponent } from './multiline-snackbar/multiline-snackbar.component';



@NgModule({
  declarations: [
    ShortNamePipe,
    SyncIndicatorComponent,
    MultilineSnackbarComponent
  ],
  exports: [
    ShortNamePipe,
    SyncIndicatorComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
  ]
})
export class SharedModule { }
