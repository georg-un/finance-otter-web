import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortNamePipe } from "./short-name.pipe";
import { SyncIndicatorComponent } from './sync-indicator/sync-indicator.component';
import { MatIconModule } from "@angular/material";



@NgModule({
  declarations: [
    ShortNamePipe,
    SyncIndicatorComponent
  ],
  exports: [
    ShortNamePipe,
    SyncIndicatorComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class SharedModule { }
