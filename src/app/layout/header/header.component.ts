import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { Location } from '@angular/common';
import { PaymentEditorService } from '../../payment-editor/payment-editor.service';
import { LayoutActions } from '../../store/actions/layout.actions';
import { LeftButtonIconEnum, RightButtonIconEnum } from './button-enums';
import { PaymentActions } from '../../store/actions/payment.actions';
import { UserActions } from '../../store/actions/user.actions';
import { LayoutSelectors } from '../../store/selectors/layout.selectors';
import { rotateOnChange } from "../layout.animations";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [rotateOnChange]
})
export class HeaderComponent implements OnInit, OnDestroy {

  protected showLogo$: Observable<boolean>;
  protected shouldSyncIconRotate$: Observable<boolean>;
  protected leftHeaderButton = 'menu';
  protected rightHeaderButton = 'sync';
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private editorService: PaymentEditorService,
              private store: Store<AppState>,
              private location: Location) { }

  ngOnInit() {
    this.showLogo$ = this.store.select(LayoutSelectors.showLogo);
    this.shouldSyncIconRotate$ = this.store.select(LayoutSelectors.shouldSyncIconRotate);

    this.store.select(LayoutSelectors.selectLeftHeaderButton)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((leftHeaderButton: string) => {
        this.leftHeaderButton = leftHeaderButton;
      });

    this.store.select(LayoutSelectors.selectRightHeaderButton)
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
    } else {
      this.store.dispatch(UserActions.requestUsers());
      this.store.dispatch(PaymentActions.syncPayments());
    }
  }

}
