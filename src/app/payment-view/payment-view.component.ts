import { Component, Input, OnInit } from '@angular/core';
import { MockRestService } from '../core/rest-service/mock-rest.service';
import { Payment } from '../core/rest-service/entity/payment';
import { Store } from "@ngrx/store";
import * as CoreActions from '../store/actions/core.actions';
import { selectPayment } from "../store/selectors/core.selectors";
import { AppState } from "../store/app.state";

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit {

  @Input() transactionId: number;
  private payment: Payment;

  constructor(private mockRestService: MockRestService,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(CoreActions.requestPaymentData({transactionId: this.transactionId}));
    this.store.select(selectPayment).subscribe((payment: Payment) => {
      this.payment = payment;
    });
  }

}
