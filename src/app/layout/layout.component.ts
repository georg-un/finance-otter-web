import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { HeaderConfig } from '../shared/domain/header-config';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  public config$: Observable<HeaderConfig> = this.layoutService.headerConfig$;

  constructor(
    private layoutService: LayoutService
  ) {
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
