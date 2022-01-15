import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-checkmark-loader',
  templateUrl: './circle-checkmark-loader.component.html',
  styleUrls: ['./circle-checkmark-loader.component.scss']
})
export class CircleCheckmarkLoaderComponent {

  private _complete: boolean;
  @Input()
  public set complete(val: boolean) {
    this._complete = val;
    this.changeDetectorRef.markForCheck();
  }

  public get complete(): boolean {
    return this._complete;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }
}
