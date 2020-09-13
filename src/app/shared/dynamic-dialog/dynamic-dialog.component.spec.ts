import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDialogComponent } from './dynamic-dialog.component';
import { TestingModule } from '../../core/testing/testing.module';
import { MaterialTestingModule } from '../../core/testing/material-testing.module';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DynamicDialogButton, DynamicDialogData } from './dynamic-dialog-data.model';

const HTML: string = '<div>foo</div>';
const HTML_WITH_SCRIPT = HTML + '<script></script>';
const BUTTON1: DynamicDialogButton = {
  index: 1,
  label: 'button1',
  color: 'red',
  result: true
};
const BUTTON2: DynamicDialogButton = {
  index: 2,
  label: 'button2',
  color: 'blue',
  result: false
};

describe('DynamicDialogComponent', () => {

  describe('with dialog data', () => {
    let component: DynamicDialogComponent;
    let fixture: ComponentFixture<DynamicDialogComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          TestingModule,
          MaterialTestingModule
        ],
        declarations: [ DynamicDialogComponent ],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: {bodyHTML: HTML_WITH_SCRIPT, buttons: [BUTTON2, BUTTON1]} as DynamicDialogData
          }
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set the body-html', () => {
      expect(component.bodyHTML).toBeTruthy();
    });

    it('should sanitize the body-html', () => {
      expect(component.bodyHTML).toBe(HTML);
    });

    it('should set the buttons', () => {
      expect(component.buttons).not.toBeUndefined();
      expect(component.buttons.length).toBe(2);
    });

    it('should sort the buttons', () => {
      expect(component['data'].buttons[0].index).toBe(1);
      expect(component['data'].buttons[1].index).toBe(2);
      expect(component.buttons[0].index).toBe(1);
      expect(component.buttons[1].index).toBe(2);
    });
  });


  describe('without dialog data', () => {
    let component: DynamicDialogComponent;
    let fixture: ComponentFixture<DynamicDialogComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          TestingModule,
          MaterialTestingModule
        ],
        declarations: [ DynamicDialogComponent ],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: undefined
          }
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not set the body-html', () => {
      expect(component.bodyHTML).toBeUndefined();
    });

    it('should not set the buttons', () => {
      expect(component.buttons).toBeUndefined();
    });
  });
});
