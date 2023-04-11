import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { HTMLInputEvent, ImageInputComponent } from './image-input.component';
import { By } from '@angular/platform-browser';

describe('ImageInputComponent', () => {
  let component: ImageInputComponent;
  let fixture: ComponentFixture<ImageInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger a camera input', () => {
    const inputRef = fixture.debugElement.query(By.css('#cameraInput'));
    let hasBeenClicked = false;
    inputRef.nativeElement.click = () => hasBeenClicked = true;
    component.triggerCameraInput();
    expect(hasBeenClicked).toEqual(true);
  });

  it('should trigger a file input', () => {
    const inputRef = fixture.debugElement.query(By.css('#fileInput'));
    let hasBeenClicked = false;
    inputRef.nativeElement.click = () => hasBeenClicked = true;
    component.triggerFileInput();
    expect(hasBeenClicked).toEqual(true);
  });

  it('should emit an imageInput event iff the input is valid', (done: DoneFn) => {
    const validImageInput = {target: {files: {0: {}}}} as unknown as HTMLInputEvent;
    component.imageInput.subscribe(event => {
      expect(event).toEqual(validImageInput.target.files);
      done();
    });
    component.onImageCapture(null);
    component.onImageCapture({target: null} as any);
    component.onImageCapture({target: {files: null}} as any);
    component.onImageCapture(validImageInput);
  });
});
