import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilineSnackbarComponent } from './multiline-snackbar.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

describe('MultilineSnackbarComponent', () => {
  let component: MultilineSnackbarComponent;
  let fixture: ComponentFixture<MultilineSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
      ],
      declarations: [ MultilineSnackbarComponent ],
      providers: [
        {provide: MAT_SNACK_BAR_DATA, useValue: 'foo'}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilineSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
