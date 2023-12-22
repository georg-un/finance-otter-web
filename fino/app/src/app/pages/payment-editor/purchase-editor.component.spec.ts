import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseEditorComponent } from './purchase-editor.component';

describe('PurchaseEditorComponent', () => {
  let component: PurchaseEditorComponent;
  let fixture: ComponentFixture<PurchaseEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
