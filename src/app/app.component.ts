import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { requestUserData } from "./store/actions/core.actions";
import { AppState } from "./store/states/app.state";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { setFAB, setFABLink, setHeaderButtons } from "./store/actions/layout.actions";

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
    this.store.dispatch(requestUserData());

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((route: NavigationEnd) => {
      switch (route.url.split('/')[1]) {
        case 'transactions':
          this.store.dispatch(setFAB({fab: 'add'}));
          this.store.dispatch(setFABLink({fabLink: '/edit'}));
          this.store.dispatch(setHeaderButtons({leftHeaderButton: 'menu', rightHeaderButton: 'sync'}));
          break;
        case 'overview':
          this.store.dispatch(setFAB({fab: 'add'}));
          this.store.dispatch(setFABLink({fabLink: '/edit'}));
          this.store.dispatch(setHeaderButtons({leftHeaderButton: 'menu', rightHeaderButton: 'sync'}));
          break;
        case 'edit':
          this.store.dispatch(setFAB({fab: null}));
          this.store.dispatch(setHeaderButtons({leftHeaderButton: 'clear', rightHeaderButton: 'done'}));
          break;
        case 'payment':
          this.store.dispatch(setFAB({fab: 'edit'}));
          this.store.dispatch(setFABLink({fabLink: '/edit/' + route.url.split('/')[2]}));
          this.store.dispatch(setHeaderButtons({leftHeaderButton: 'clear', rightHeaderButton: 'sync'}));
          break;
      }
    });

  }

}
