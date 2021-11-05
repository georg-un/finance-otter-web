import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptProcessorComponent } from './receipt-processor.component';
import { NgxDocumentScannerModule, OpenCVConfig } from '@fino-ngx-doc-scanner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';


const openCVConfig: OpenCVConfig = {
  openCVDirPath: './assets'
};


@NgModule({
  declarations: [
    ReceiptProcessorComponent
  ],
  imports: [
    CommonModule,
    NgxDocumentScannerModule.forRoot(openCVConfig),
    MatProgressSpinnerModule
  ]
})
export class ReceiptProcessorModule { }
