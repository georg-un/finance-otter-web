import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCardComponent } from './purchase-card.component';
import { TestingModule } from '../../../core/testing/testing.module';
import { MaterialTestingModule } from '../../../core/testing/material-testing.module';
import { PURCHASES } from '../../../core/mock/data/purchases';
import { SyncIndicatorModule } from '../../../shared/sync-indicator/sync-indicator.module';

describe('PurchaseCardComponent', () => {
  let component: PurchaseCardComponent;
  let fixture: ComponentFixture<PurchaseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        SyncIndicatorModule
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
