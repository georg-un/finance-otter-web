import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncIndicatorComponent } from './sync-indicator.component';
import { MatIconModule } from '@angular/material';



@NgModule({
  declarations: [
    SyncIndicatorComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    SyncIndicatorComponent
  ]
})
export class SyncIndicatorModule { }
