import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitCardComponent } from './debit-card.component';
import {PURCHASE1} from '../../core/mock/data/purchase1';
import {Debit} from '../../core/entity/debit';

describe('DebitCardComponent', () => {
  let component: DebitCardComponent;
  let fixture: ComponentFixture<DebitCardComponent>;
  const mockedDebit: Debit = PURCHASE1.debits[0];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitCardComponent);
    component = fixture.componentInstance;
    component.debit = mockedDebit;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
