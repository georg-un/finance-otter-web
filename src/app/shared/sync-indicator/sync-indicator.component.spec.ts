import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncIndicatorComponent } from './sync-indicator.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { SyncStatusEnum } from '../../core/entity/purchase';

describe('SyncIndicatorComponent', () => {
  let component: SyncIndicatorComponent;
  let fixture: ComponentFixture<SyncIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule
      ],
      declarations: [ SyncIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the icon for Remote', () => {
    component.syncStatus = SyncStatusEnum.Remote;
    component.ngOnChanges(null);
    expect(component.icon).toBe('done');
    expect(component.colorClass).toBe('success');
  });

  it('should set the icon for Syncing', () => {
    component.syncStatus = SyncStatusEnum.Syncing;
    component.ngOnChanges(null);
    expect(component.icon).toBe('sync');
    expect(component.colorClass).toBe('process');
  });

  it('should set the icon for Local states', () => {
    const localStates = [SyncStatusEnum.Local, SyncStatusEnum.LocalDelete, SyncStatusEnum.LocalUpdate];
    localStates.forEach(state => {
      component.syncStatus = state;
      component.ngOnChanges(null);
      expect(component.icon).toBe('sync_problem');
      expect(component.colorClass).toBe('error');
    });
  });

});
