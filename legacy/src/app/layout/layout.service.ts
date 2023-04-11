import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HeaderConfig } from '../shared/domain/header-config';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private _isSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isSidenavOpen$: Observable<boolean> = this._isSidenavOpen.asObservable();

  private _headerConfig: BehaviorSubject<HeaderConfig> = new BehaviorSubject<HeaderConfig>(undefined);
  public headerConfig$: Observable<HeaderConfig> = this._headerConfig.asObservable();

  private _rightHeaderButtonClickCallback: () => void;
  private _leftHeaderButtonClickCallback: () => void;

  public registerRightHeaderButtonClickCallback(callbackFn: () => void): void {
    this._rightHeaderButtonClickCallback = callbackFn;
  }

  public registerLeftHeaderButtonClickCallback(callbackFn: () => void): void {
    this._leftHeaderButtonClickCallback = callbackFn;
  }

  public get leftHeaderButtonClickCallback(): () => void {
    return this._leftHeaderButtonClickCallback;
  }

  public get rightHeaderButtonClickCallback(): () => void {
    return this._rightHeaderButtonClickCallback;
  }

  public setHeaderConfig(config: HeaderConfig): void {
    this._headerConfig.next(config);
  }

  public setSidenavOpened(opened: boolean): void {
    this._isSidenavOpen.next(opened);
  }

  public toggleSidenav(): void {
    this._isSidenavOpen.next(!this._isSidenavOpen.value);
  }
}
