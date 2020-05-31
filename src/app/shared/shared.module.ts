import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortNamePipe } from './short-name.pipe';
import { SyncIndicatorComponent } from './sync-indicator/sync-indicator.component';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule } from '@angular/material';
import { MultilineSnackbarComponent } from './multiline-snackbar/multiline-snackbar.component';
import { DynamicDialogComponent } from './dynamic-dialog/dynamic-dialog.component';


@NgModule({
  declarations: [
    ShortNamePipe,
    SyncIndicatorComponent,
    MultilineSnackbarComponent,
    DynamicDialogComponent
  ],
  exports: [
    ShortNamePipe,
    SyncIndicatorComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
  ]
})
export class SharedModule { }
