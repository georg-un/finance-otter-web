import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RECEIPT_API_URLS } from '../../../../../domain/receipt-api-models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receipt-viewer',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <img [src]="receiptUri" (load)="imageLoaded.next()" class="receipt" alt="Picture of the receipt"/>
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
  @Input() set receiptName(name: string) {
    this.receiptUri = RECEIPT_API_URLS.READ.get(name);
  }

  @Output() imageLoaded = new EventEmitter<void>();

  receiptUri: string | undefined;
}
