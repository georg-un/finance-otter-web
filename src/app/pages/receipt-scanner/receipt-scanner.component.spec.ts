import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptScannerComponent } from './receipt-scanner.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { NgxDocumentScannerModule } from 'ngx-document-scanner';

describe('ReceiptScannerComponent', () => {
  let component: ReceiptScannerComponent;
  let fixture: ComponentFixture<ReceiptScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        NgxDocumentScannerModule.forRoot({
          openCVDirPath: './assets'
        })
      ],
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
