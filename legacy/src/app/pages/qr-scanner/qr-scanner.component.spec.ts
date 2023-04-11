import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrScannerComponent } from './qr-scanner.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CircleCheckmarkLoaderModule } from '../../shared/circle-checkmark-loader/circle-checkmark-loader.module';

describe('QrScannerComponent', () => {
  let component: QrScannerComponent;
  let fixture: ComponentFixture<QrScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        ZXingScannerModule,
        CircleCheckmarkLoaderModule
      ],
      declarations: [ QrScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
