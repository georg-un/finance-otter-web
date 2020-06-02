import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseListComponent } from './purchase-list.component';
import {PurchaseCardComponent} from './purchase-card/purchase-card.component';
import {MatCardModule} from '@angular/material';

describe('PurchaseListComponent', () => {
  let component: PurchaseListComponent;
  let fixture: ComponentFixture<PurchaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
      ],
      declarations: [
        PurchaseListComponent,
        PurchaseCardComponent,
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
