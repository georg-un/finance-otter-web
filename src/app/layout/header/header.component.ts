import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '../sidenav/sidenav.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { Location } from '@angular/common';
import { selectLeftHeaderButton, selectRightHeaderButton } from '../../store/selectors/layout.selectors';
import { EditorService } from '../../payment-editor/editor.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  protected leftHeaderButton = 'menu';
  protected rightHeaderButton = 'sync';
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private sidenavService: SidenavService,
              private editorService: EditorService,
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
    if (this.leftHeaderButton === 'clear') {
      this.location.back();
    } else if (this.leftHeaderButton === 'menu') {
      this.sidenavService.toggle();
    }
  }

  onRightButtonClick(): void {
    this.editorService.emitAddPaymentTrigger();
  }

}
