import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseEditorNewComponent } from './purchase-editor-new.component';

describe('PurchaseEditorNewComponent', () => {
  let component: PurchaseEditorNewComponent;
  let fixture: ComponentFixture<PurchaseEditorNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseEditorNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseEditorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
