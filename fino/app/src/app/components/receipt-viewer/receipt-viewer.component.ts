import { Component, Input } from '@angular/core';
import { RECEIPT_API_URLS } from '../../../../../domain/receipt-api-models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receipt-viewer',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <img [src]="receiptSrc" class="receipt" alt="Picture of the receipt"/>
  `,
  styles: [`
    .receipt {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
  `]
})
export class ReceiptViewerComponent {
  @Input() set receiptName(receiptName: string) {
    this.receiptSrc = receiptName.startsWith('data:') ? receiptName : RECEIPT_API_URLS.READ.get(receiptName);
  }

  receiptSrc!: string;
}
