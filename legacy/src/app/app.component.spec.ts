import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import {SidenavComponent} from './layout/sidenav/sidenav.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TestingModule } from './core/testing/testing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        TestingModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatCardModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
