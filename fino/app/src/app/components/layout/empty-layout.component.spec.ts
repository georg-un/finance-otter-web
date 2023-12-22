import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyLayoutComponent } from './empty-layout.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmptyLayoutComponent', () => {
  let component: EmptyLayoutComponent;
  let fixture: ComponentFixture<EmptyLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyLayoutComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmptyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
