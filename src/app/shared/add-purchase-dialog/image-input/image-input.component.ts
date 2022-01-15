import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';


export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageInputComponent {

  @ViewChild('cameraInput', {static: false}) private cameraInput: ElementRef;
  @ViewChild('fileInput', {static: false}) private fileInput: ElementRef;

  @Output()
  public imageInput: EventEmitter<FileList> = new EventEmitter<FileList>();

  public triggerCameraInput(): void {
    this.cameraInput.nativeElement.click();
  }

  public triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  public onImageCapture($event: HTMLInputEvent): void {
    if ($event?.target?.files) {
      this.imageInput.next($event.target.files);
    }
  }
}
