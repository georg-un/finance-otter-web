import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ReceiptService } from '../../services/receipt.service';
import { Destroyable } from '../../components/destroyable';
import { takeUntil } from 'rxjs/operators';
import { RECEIPT_API_URLS } from '../../../../../domain/receipt-api-models';

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
  ]
})
export class ReceiptEditorComponent extends Destroyable implements AfterViewInit {

  receiptUri?: string;
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
    this.receiptUri = val ? RECEIPT_API_URLS.READ.get(val) : undefined;
  }

  ngAfterViewInit() {
    this.triggerCameraInput();
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


// TODO: the 'add compensation' link will be part of the more page
