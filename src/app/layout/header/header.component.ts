import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { Location } from '@angular/common';
import { selectLeftHeaderButton, selectRightHeaderButton } from '../../store/selectors/layout.selectors';
import { EditorService } from '../../payment-editor/editor.service';
import { LayoutActions } from '../../store/actions/layout.actions';
import { LeftButtonIconEnum, RightButtonIconEnum } from './button-enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  protected leftHeaderButton = 'menu';
  protected rightHeaderButton = 'sync';
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private editorService: EditorService,
              private store: Store<AppState>,
              private location: Location) { }

  ngOnInit() {
    this.store.select(selectLeftHeaderButton)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((leftHeaderButton: string) => {
        this.leftHeaderButton = leftHeaderButton;
      });

    this.store.select(selectRightHeaderButton)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((rightHeaderButton: string) => {
        this.rightHeaderButton = rightHeaderButton;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onLeftButtonClick(): void {
    if (this.leftHeaderButton !== LeftButtonIconEnum.Menu) {
      this.location.back();
    } else {
      this.store.dispatch(LayoutActions.toggleSidenav());
    }
  }

  onRightButtonClick(): void {
    if (this.rightHeaderButton === RightButtonIconEnum.Done) {
      this.editorService.emitAddPaymentTrigger();
    }
  }

}
