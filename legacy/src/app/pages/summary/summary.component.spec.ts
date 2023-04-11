import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryComponent } from './summary.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { DebitCardModule } from '../../shared/debit-card/debit-card.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        DebitCardModule,
        NgxChartsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
      ],
      declarations: [
        SummaryComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
