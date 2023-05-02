import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseListPageComponent } from './purchase-list-page.component';

describe('PurchaseListPageComponent', () => {
  let component: PurchaseListPageComponent;
  let fixture: ComponentFixture<PurchaseListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseListPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
