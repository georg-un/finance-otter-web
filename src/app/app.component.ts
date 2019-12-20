import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/states/app.state';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LayoutActions } from './store/actions/layout.actions';
import { UserActions } from './store/actions/user.actions';
import { LeftButtonIconEnum, RightButtonIconEnum } from './layout/header/button-enums';
import { PaymentActions } from "./store/actions/payment.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(UserActions.requestUsers());
    this.store.dispatch(PaymentActions.requestPayments({offset: 0, limit: 0}));

    // TODO: Move this logic to ngrx router
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((route: NavigationEnd) => {
      switch (route.url.split('/')[1]) {
        case 'transactions':
          this.store.dispatch(LayoutActions.setFAB({fab: 'add'}));
          this.store.dispatch(LayoutActions.setFABLink({fabLink: '/new'}));
          this.store.dispatch(LayoutActions.setHeaderButtons(
            {leftHeaderButton: LeftButtonIconEnum.Menu, rightHeaderButton: RightButtonIconEnum.Sync}
            ));
          break;
        case 'overview':
          this.store.dispatch(LayoutActions.setFAB({fab: 'add'}));
          this.store.dispatch(LayoutActions.setFABLink({fabLink: '/new'}));
          this.store.dispatch(LayoutActions.setHeaderButtons(
            {leftHeaderButton: LeftButtonIconEnum.Menu, rightHeaderButton: RightButtonIconEnum.Sync}
            ));
          break;
        case 'edit':
        case 'new':
          this.store.dispatch(LayoutActions.setFAB({fab: null}));
          this.store.dispatch(LayoutActions.setHeaderButtons(
            {leftHeaderButton: LeftButtonIconEnum.Clear, rightHeaderButton: RightButtonIconEnum.Done}
            ));
          break;
        case 'payment':
          this.store.dispatch(LayoutActions.setFAB({fab: 'edit'}));
          this.store.dispatch(LayoutActions.setFABLink({fabLink: '/edit/' + route.url.split('/')[2]}));
          this.store.dispatch(LayoutActions.setHeaderButtons(
            {leftHeaderButton: LeftButtonIconEnum.Back, rightHeaderButton: RightButtonIconEnum.Sync}
            ));
          break;
      }
    });

  }

}
