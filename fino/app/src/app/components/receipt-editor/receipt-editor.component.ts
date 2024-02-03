import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ReceiptService } from '../../services/receipt.service';
import { Destroyable } from '../destroyable';
import { takeUntil } from 'rxjs/operators';
import { ReceiptViewerComponent } from '../receipt-viewer/receipt-viewer.component';

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-receipt-editor',
  templateUrl: './receipt-editor.component.html',
  styleUrls: ['receipt-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    ReceiptViewerComponent,
  ]
})
export class ReceiptEditorComponent extends Destroyable {
  @Output() receiptNameChange = new EventEmitter<string | undefined>();
  @ViewChild('cameraInput', { static: false }) private cameraInput?: ElementRef;
  @ViewChild('fileInput', { static: false }) private fileInput?: ElementRef;

  constructor(
    private receiptService: ReceiptService,
  ) {
    super();
  }

  private _receiptName?: string;

  get receiptName(): string | undefined {
    return this._receiptName;
  }

  @Input()
  set receiptName(val: string | undefined) {
    this._receiptName = val;
  }

  triggerCameraInput(): void {
    this.cameraInput?.nativeElement.click();
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  onImageCapture($event: HTMLInputEvent): void {
    const file = $event?.target?.files?.item(0);
    if (file) {
      this.receiptService.uploadReceipt(file).pipe(
        takeUntil(this.onDestroy$)
      ).subscribe((receiptName) => {
        this.receiptName = receiptName;
      });
    }
  }

  onImageLoaded(): void {
    this.receiptNameChange.next(this.receiptName);
  }
}
