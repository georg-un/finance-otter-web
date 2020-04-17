import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptScannerComponent } from './receipt-scanner.component';

describe('ReceiptScannerComponent', () => {
  let component: ReceiptScannerComponent;
  let fixture: ComponentFixture<ReceiptScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
