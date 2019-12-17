import { Component, OnInit } from '@angular/core';
import { Payment } from '../core/rest-service/entity/payment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Observable } from 'rxjs';
import { User } from '../core/rest-service/entity/user';
import { UserSelectors } from '../store/selectors/user.selectors';
import { PaymentSelectors } from '../store/selectors/payment.selectors';


@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit {

  // FIXME: Load entity data if not present.

  private payment$: Observable<Payment>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.payment$ = this.store.select(PaymentSelectors.selectCurrentPayment);
  }

  selectUserById(id: number): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

}
