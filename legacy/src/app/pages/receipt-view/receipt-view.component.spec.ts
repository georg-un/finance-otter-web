import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptViewComponent } from './receipt-view.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ReceiptViewComponent', () => {
  let component: ReceiptViewComponent;
  let fixture: ComponentFixture<ReceiptViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ ReceiptViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptViewComponent);
    component = fixture.componentInstance;
    component.receipt = of(undefined);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
