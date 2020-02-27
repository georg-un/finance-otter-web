import { Component, OnInit } from '@angular/core';
import { Payment } from '../core/entity/payment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Observable } from 'rxjs';
import { User } from '../core/entity/user';
import { UserSelectors } from '../store/selectors/user.selectors';
import { PaymentSelectors } from '../store/selectors/payment.selectors';
import { take } from "rxjs/operators";
import { PaymentActions } from "../store/actions/payment.actions";


@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit {

  // FIXME: Load entity data if not present.
  private payment: Payment;
  private user$: Observable<User>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(PaymentSelectors.selectCurrentPayment)
      .pipe(take(1))
      .subscribe((payment) => {
      this.payment = payment;
      this.user$ = this.selectUserById(payment.userId);
    })
  }

  selectUserById(id: number): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

  onDeleteButtonClick(): void {
    this.store.dispatch(PaymentActions.deletePayment({payment: this.payment}));
  }

}
