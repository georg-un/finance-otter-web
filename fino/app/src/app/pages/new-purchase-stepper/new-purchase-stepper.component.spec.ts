import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseStepperComponent } from './new-purchase-stepper.component';

describe('NewPurchaseStepperComponent', () => {
  let component: NewPurchaseStepperComponent;
  let fixture: ComponentFixture<NewPurchaseStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPurchaseStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPurchaseStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
