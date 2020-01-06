import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEditorNewComponent } from './payment-editor-new.component';

describe('PaymentEditorNewComponent', () => {
  let component: PaymentEditorNewComponent;
  let fixture: ComponentFixture<PaymentEditorNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentEditorNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentEditorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
