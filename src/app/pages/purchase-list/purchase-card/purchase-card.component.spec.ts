import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCardComponent } from './purchase-card.component';
import { TestingModule } from '../../../core/testing/testing.module';
import { MaterialTestingModule } from '../../../core/testing/material-testing.module';
import { SharedModule } from '../../../shared/shared.module';
import { PURCHASES } from '../../../core/mock/data/purchases';

describe('PurchaseCardComponent', () => {
  let component: PurchaseCardComponent;
  let fixture: ComponentFixture<PurchaseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        SharedModule
      ],
      declarations: [
        PurchaseCardComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseCardComponent);
    component = fixture.componentInstance;
    component.purchase = PURCHASES[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
