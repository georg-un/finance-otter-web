import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptProcessorComponent } from './receipt-processor.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { NgxDocumentScannerModule } from '@fino-ngx-doc-scanner';

describe('ReceiptScannerComponent', () => {
  let component: ReceiptProcessorComponent;
  let fixture: ComponentFixture<ReceiptProcessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        NgxDocumentScannerModule.forRoot({
          openCVDirPath: './assets'
        })
      ],
      declarations: [ ReceiptProcessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
