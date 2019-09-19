import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import {SidenavService} from './sidenav.service';
import {MatIconModule, MatListModule, MatSidenavModule} from '@angular/material';
import {MockRestService} from '../../rest-service/mock-rest.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
      ],
      declarations: [ SidenavComponent ],
      providers: [
        SidenavService,
        {provide: MockRestService, useClass: MockRestService},
      ]
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
