import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentViewComponent } from './payment-view.component';
import {MockRestService} from '../rest-service/mock-rest.service';
import {DebitCardComponent} from '../debit-card/debit-card.component';

describe('PaymentViewComponent', () => {
  let component: PaymentViewComponent;
  let fixture: ComponentFixture<PaymentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentViewComponent,
        DebitCardComponent,
      ],
      providers: [
        {provide: MockRestService, useClass: MockRestService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentViewComponent);
    component = fixture.componentInstance;
    component.transactionId = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
