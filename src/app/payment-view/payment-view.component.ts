import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Payment } from '../core/rest-service/entity/payment';
import { Store } from "@ngrx/store";
import * as CoreActions from '../store/actions/core.actions';
import { selectPayment } from "../store/selectors/core.selectors";
import { AppState } from "../store/states/app.state";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit, OnDestroy {

  private payment$: Observable<Payment>;
  @Input() transactionId: number;

  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(CoreActions.requestPaymentData({transactionId: this.transactionId}));
    this.payment$ = this.store.select(selectPayment)
      .pipe(takeUntil(this.onDestroy$));
  }

  ngOnDestroy(): void {
    this.store.dispatch(CoreActions.clearPaymentData());
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}
