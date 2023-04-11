import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleCheckmarkLoaderComponent } from './circle-checkmark-loader.component';



@NgModule({
  declarations: [
    CircleCheckmarkLoaderComponent
  ],
  exports: [
    CircleCheckmarkLoaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CircleCheckmarkLoaderModule { }
