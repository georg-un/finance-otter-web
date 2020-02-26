import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/states/app.state';
import { UserActions } from './store/actions/user.actions';
import { PaymentActions } from "./store/actions/payment.actions";
import { AuthService } from "./shared/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(UserActions.requestUsers());
    this.store.dispatch(PaymentActions.requestPayments({offset: 0, limit: 0}));
  }

}
