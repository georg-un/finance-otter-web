import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { LayoutSelectors } from '../store/selectors/layout.selectors';
import { HeaderButtonConfig } from '../shared/domain/header-config';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  public showHeaderLogo$: Observable<boolean>;
  public leftHeaderButtonConfig$: Observable<HeaderButtonConfig>;
  public rightHeaderButtonConfig$: Observable<HeaderButtonConfig>;

  private onDestroy$: Subject<boolean> = new Subject();

  constructor(
    private store: Store<AppState>,
    private layoutService: LayoutService
  ) {
  }

  ngOnInit() {
    this.leftHeaderButtonConfig$ = this.store.select(LayoutSelectors.selectLeftHeaderConfig);
    this.rightHeaderButtonConfig$ = this.store.select(LayoutSelectors.selectRightHeaderConfig);
    this.showHeaderLogo$ = this.store.select(LayoutSelectors.showHeaderLogo);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  public onLeftHeaderButtonClicked() {
    this.layoutService.leftHeaderButtonClickCallback();
  }

  public onRightHeaderButtonClicked() {
    this.layoutService.rightHeaderButtonClickCallback();
  }
}
