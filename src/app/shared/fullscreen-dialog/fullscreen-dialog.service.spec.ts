import { TestBed } from '@angular/core/testing';

import { FullscreenDialogService } from './fullscreen-dialog.service';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { Subject } from 'rxjs';

describe('FullscreenDialogService', () => {

  let service: FullscreenDialogService;
  let mockedDialogRef: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule
      ]
    });
    service = TestBed.get(FullscreenDialogService);
    mockedDialogRef = {
      componentInstance: {close: new Subject(), scanSuccess: new Subject()},
      afterClosed: () => new Subject(),
      close: () => {
      }
    };
  });

  beforeEach(() => {
    spyOn(service['dialog'], 'open').and.returnValue(mockedDialogRef);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('ReceiptViewDialog', () => {

    it('should open the dialog', () => {
      service.openReceiptViewDialog(undefined, false, undefined);
      expect(service['dialog'].open).toHaveBeenCalledTimes(1);
    });

    it('should set the input', () => {
      service.openReceiptViewDialog(null, true, 'id1');
      expect(mockedDialogRef.componentInstance.receipt).toBe(null);
      expect(mockedDialogRef.componentInstance.purchaseId).toBe('id1');
      expect(mockedDialogRef.componentInstance.enableEditButtons).toBe(true);
    });

    it('should close the dialog', () => {
      spyOn(mockedDialogRef, 'close').and.callThrough();
      service.openReceiptViewDialog(undefined, false, undefined);
      expect(mockedDialogRef.close).toHaveBeenCalledTimes(0);
      mockedDialogRef.componentInstance.close.next(true);
      expect(mockedDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });


  describe('QrScannerDialog', () => {

    it('should open the dialog', () => {
      service.openQrScannerDialog().subscribe();
      expect(service['dialog'].open).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog', () => {
      spyOn(mockedDialogRef, 'close').and.callThrough();
      service.openQrScannerDialog().subscribe();
      expect(mockedDialogRef.close).toHaveBeenCalledTimes(0);
      mockedDialogRef.componentInstance.close.next(true);
      expect(mockedDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog on scan result', () => {
      spyOn(mockedDialogRef, 'close').and.callThrough();
      service.openQrScannerDialog().subscribe();
      expect(mockedDialogRef.close).toHaveBeenCalledTimes(0);
      mockedDialogRef.componentInstance.scanSuccess.next(true);
      expect(mockedDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should not close the dialog on empty scan result', () => {
      spyOn(mockedDialogRef, 'close').and.callThrough();
      service.openQrScannerDialog().subscribe();
      expect(mockedDialogRef.close).toHaveBeenCalledTimes(0);
      mockedDialogRef.componentInstance.scanSuccess.next();
      expect(mockedDialogRef.close).toHaveBeenCalledTimes(0);
    });
  });

});
