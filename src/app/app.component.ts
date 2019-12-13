import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/states/app.state';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LayoutActions } from './store/actions/layout.actions';
import { UserActions } from './store/actions/user.actions';

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

    // TODO: Move this logic to ngrx router
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((route: NavigationEnd) => {
      switch (route.url.split('/')[1]) {
        case 'transactions':
          this.store.dispatch(LayoutActions.setFAB({fab: 'add'}));
          this.store.dispatch(LayoutActions.setFABLink({fabLink: '/edit'}));
          this.store.dispatch(LayoutActions.setHeaderButtons({leftHeaderButton: 'menu', rightHeaderButton: 'sync'}));
          break;
        case 'overview':
          this.store.dispatch(LayoutActions.setFAB({fab: 'add'}));
          this.store.dispatch(LayoutActions.setFABLink({fabLink: '/edit'}));
          this.store.dispatch(LayoutActions.setHeaderButtons({leftHeaderButton: 'menu', rightHeaderButton: 'sync'}));
          break;
        case 'edit':
          this.store.dispatch(LayoutActions.setFAB({fab: null}));
          this.store.dispatch(LayoutActions.setHeaderButtons({leftHeaderButton: 'clear', rightHeaderButton: 'done'}));
          break;
        case 'payment':
          this.store.dispatch(LayoutActions.setFAB({fab: 'edit'}));
          this.store.dispatch(LayoutActions.setFABLink({fabLink: '/edit/' + route.url.split('/')[2]}));
          this.store.dispatch(LayoutActions.setHeaderButtons({leftHeaderButton: 'clear', rightHeaderButton: 'sync'}));
          break;
      }
    });

  }

}
