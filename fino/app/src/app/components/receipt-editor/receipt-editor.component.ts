import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Destroyable } from '../destroyable';
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
  @ViewChild('cameraInput', { static: false }) private cameraInput?: ElementRef;
  @ViewChild('fileInput', { static: false }) private fileInput?: ElementRef;

  @Output() imageCapture = new EventEmitter<File>();
  @Output() deleteReceipt = new EventEmitter<void>();

  @Input() receiptSrc?: string;

  triggerCameraInput(): void {
    this.cameraInput?.nativeElement.click();
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  onImageCapture($event: HTMLInputEvent): void {
    const file = $event?.target?.files?.item(0);
    if (file) {
      this.imageCapture.emit(file);
    }
  }

  onDeleteReceipt(): void {
    if (!this.receiptSrc) {
      return;
    }
    this.deleteReceipt.emit();
  }
}
