import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { CircleCheckmarkLoaderComponent } from './circle-checkmark-loader.component';
import { By } from '@angular/platform-browser';

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

  it('should set the complete value', () => {
    expect(component.complete).toBeUndefined();
    component.complete = true;
    expect(component.complete).toEqual(true);
  });

  it('should update the UI on complete', () => {
    const checkmark = fixture.debugElement.query(By.css('.circle-loader .checkmark'))?.nativeElement;
    expect(checkmark).toBeTruthy();
    expect(checkmark.style.display).toEqual('none');
    component.complete = true;
    fixture.detectChanges();
    expect(checkmark.style.display).toEqual('block');
  });
});
