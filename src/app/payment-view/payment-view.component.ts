import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MockRestService } from '../core/rest-service/mock-rest.service';
import { Payment } from '../core/rest-service/entity/payment';
import { Store } from "@ngrx/store";
import * as CoreActions from '../store/actions/core.actions';
import { selectPayment } from "../store/selectors/core.selectors";
import { AppState } from "../store/app.state";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit, OnDestroy {

  private payment: Payment;
  @Input() transactionId: number;

  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private mockRestService: MockRestService,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(CoreActions.requestPaymentData({transactionId: this.transactionId}));
    this.store.select(selectPayment)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((payment: Payment) => {
        this.payment = payment;
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(CoreActions.clearPaymentData());
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}
