import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseViewComponent } from './purchase-view.component';
import {DebitCardComponent} from './debit-card/debit-card.component';

describe('PurchaseViewComponent', () => {
  let component: PurchaseViewComponent;
  let fixture: ComponentFixture<PurchaseViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PurchaseViewComponent,
        DebitCardComponent,
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
