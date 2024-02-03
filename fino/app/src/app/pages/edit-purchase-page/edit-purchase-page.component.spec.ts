import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPurchasePageComponent } from './edit-purchase-page.component';

describe('EditPurchasePageComponent', () => {
  let component: EditPurchasePageComponent;
  let fixture: ComponentFixture<EditPurchasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPurchasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPurchasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
