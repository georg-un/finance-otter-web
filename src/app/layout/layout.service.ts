import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

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
}
