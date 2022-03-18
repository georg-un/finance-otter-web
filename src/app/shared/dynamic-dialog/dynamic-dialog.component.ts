import { ChangeDetectionStrategy, Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicDialogButton, DynamicDialogData } from './dynamic-dialog-data.model';

@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicDialogComponent implements OnInit {

  public bodyHTML: string;
  public buttons: DynamicDialogButton[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DynamicDialogData,
    private dom: DomSanitizer
  ) { }

  public ngOnInit(): void {
    if (this.data) {
      if (this.data.bodyHTML) {
        this.bodyHTML = this.dom.sanitize(SecurityContext.HTML, this.data.bodyHTML);
      }
      if (this.data.buttons) {
        this.buttons = this.data.buttons;
        this.buttons = this.buttons.sort(this.compareByIndex);
      }
    }
  }

  private compareByIndex(a: DynamicDialogButton, b: DynamicDialogButton): number {
    if (a.index < b.index) {
      return -1;
    } else if (a.index > b.index) {
      return 1;
    } else {
      return 0;
    }
  }
}
