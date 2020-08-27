import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';
import { TestingModule } from '../core/testing/testing.module';
import { MaterialTestingModule } from '../core/testing/material-testing.module';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AppState } from '../store/states/app.state';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let store: Store<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
      ],
      declarations: [
        LayoutComponent,
        HeaderComponent,
        SidenavComponent
      ]
    })
    .compileComponents()
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'select').and.returnValue(of('add'));
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
