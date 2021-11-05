import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseDialogComponent } from './add-purchase-dialog.component';

describe('AddPurchaseDialogComponent', () => {
  let component: AddPurchaseDialogComponent;
  let fixture: ComponentFixture<AddPurchaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPurchaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurchaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
