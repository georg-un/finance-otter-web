import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ SidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
