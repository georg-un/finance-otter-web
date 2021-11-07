import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { AddPurchaseDialogComponent } from './add-purchase-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ImageInputComponent } from './image-input/image-input.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReceiptProcessorService } from '../../pages/receipt-processor/receipt-processor.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AddPurchaseDialogComponent', () => {
  const FILES = {0: {foo: 'bar'}, 1: {}, length: 2} as unknown as FileList;

  let component: AddPurchaseDialogComponent;
  let fixture: ComponentFixture<AddPurchaseDialogComponent>;
  let receiptProcessorService: ReceiptProcessorService;
  let snackBar: MatSnackBar;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddPurchaseDialogComponent,
        ImageInputComponent
      ],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        MatSnackBarModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {
            }
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurchaseDialogComponent);
    receiptProcessorService = TestBed.inject(ReceiptProcessorService);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Add receipt', () => {
    it('should use the first file as image', () => {
      const snackBarOpenSpy = spyOn(snackBar, 'open').and.callThrough();
      spyOn(router, 'navigate').and.callFake(() => of(true).toPromise());
      component.onImageCapture(FILES);
      expect(receiptProcessorService.receipt['foo']).toEqual('bar');
      expect(snackBarOpenSpy).toHaveBeenCalledTimes(1);
    });

    it('should navigate without query params in create mode', () => {
      component.data.purchaseId = undefined;
      const navigateSpy = spyOn(router, 'navigate').and.callFake(() => of(true).toPromise());
      component.onImageCapture(FILES);
      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy.calls.mostRecent().args[1]).not.toBeUndefined();
      expect(navigateSpy.calls.mostRecent().args[1]['queryParams']).toBeUndefined();
      expect(navigateSpy.calls.mostRecent().args[1]['replaceUrl']).toEqual(false);
    });


    it('should navigate with query params in update mode', () => {
      component.data.purchaseId = 'foo';
      const navigateSpy = spyOn(router, 'navigate').and.callFake(() => of(true).toPromise());
      component.onImageCapture(FILES);
      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy.calls.mostRecent().args[1]).not.toBeUndefined();
      expect(navigateSpy.calls.mostRecent().args[1]['queryParams']).not.toBeUndefined();
      expect(navigateSpy.calls.mostRecent().args[1]['replaceUrl']).toEqual(true);
    });

    it('should close the dialog after navigation', fakeAsync(() => {
      spyOn(router, 'navigate').and.callFake(() => of(true).toPromise());
      const closeDialogSpy = spyOn(component['dialogRef'], 'close').and.callThrough();
      component.onImageCapture(FILES);
      flush();
      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Add purchase w/o receipt', () => {
    it('should continue without receipt', () => {
      const routerNavigateSpy = spyOn(router, 'navigate').and.callFake(() => of(true).toPromise());
      component.addPurchaseWithoutReceipt();
      expect(receiptProcessorService.receipt).toBeUndefined();
      expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
      expect(routerNavigateSpy.calls.mostRecent().args[0]).toEqual(['new']);
    });

    it('should close the dialog after navigation', fakeAsync(() => {
      spyOn(router, 'navigate').and.callFake(() => of(true).toPromise());
      const closeDialogSpy = spyOn(component['dialogRef'], 'close').and.callThrough();
      component.addPurchaseWithoutReceipt();
      flush();
      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    }));
  });


});
