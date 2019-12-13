import { Component, OnDestroy, OnInit } from '@angular/core';
import { Payment } from '../core/rest-service/entity/payment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { User } from '../core/rest-service/entity/user';
import { UserSelectors } from '../store/selectors/user.selectors';
import { PaymentSelectors } from '../store/selectors/payment.selectors';


@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit, OnDestroy {

  // FIXME: Load entity data if not present.

  private payment$: Observable<Payment>;
  private transactionId: string;

  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(params => {
      this.transactionId = params.get('transactionId');
    });

    // this.store.dispatch(PaymentActions.requestPaymentData({transactionId: this.transactionId}));
    this.payment$ = this.store.select(PaymentSelectors.selectPaymentById(), {id: this.transactionId});
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  selectUserById(id: number): Observable<User> {
    return this.store.select(UserSelectors.selectUserById(), {id: id});
  }

}
