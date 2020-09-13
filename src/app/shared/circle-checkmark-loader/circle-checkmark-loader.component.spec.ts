import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { CircleCheckmarkLoaderComponent } from './circle-checkmark-loader.component';

describe('CircleCheckmarkLoaderComponent', () => {
  let component: CircleCheckmarkLoaderComponent;
  let fixture: ComponentFixture<CircleCheckmarkLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule
      ],
      declarations: [ CircleCheckmarkLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleCheckmarkLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
