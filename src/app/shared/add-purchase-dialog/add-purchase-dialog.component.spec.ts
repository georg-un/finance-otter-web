import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseDialogComponent } from './add-purchase-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ImageInputComponent } from './image-input/image-input.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddPurchaseDialogComponent', () => {
  let component: AddPurchaseDialogComponent;
  let fixture: ComponentFixture<AddPurchaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddPurchaseDialogComponent,
        ImageInputComponent
      ],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        MatSnackBarModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
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
