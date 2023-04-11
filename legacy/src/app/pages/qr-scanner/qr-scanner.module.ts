import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrScannerComponent } from './qr-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CircleCheckmarkLoaderModule } from '../../shared/circle-checkmark-loader/circle-checkmark-loader.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [QrScannerComponent],
  imports: [
    CommonModule,
    ZXingScannerModule,
    MatButtonModule,
    MatIconModule,
    CircleCheckmarkLoaderModule
  ]
})
export class QrScannerModule { }
