import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseListComponent } from './purchase-list.component';
import { PurchaseCardComponent } from './purchase-card/purchase-card.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SyncIndicatorModule } from '../../shared/sync-indicator/sync-indicator.module';

describe('PurchaseListComponent', () => {
  let component: PurchaseListComponent;
  let fixture: ComponentFixture<PurchaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        InfiniteScrollModule,
        SyncIndicatorModule
      ],
      declarations: [
        PurchaseListComponent,
        PurchaseCardComponent,
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
