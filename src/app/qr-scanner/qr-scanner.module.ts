import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrScannerComponent } from './qr-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [QrScannerComponent],
  imports: [
    CommonModule,
    ZXingScannerModule,
    MatButtonModule,
    MatIconModule,
    SharedModule
  ]
})
export class QrScannerModule { }
