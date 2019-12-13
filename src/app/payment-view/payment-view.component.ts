import { Component, OnDestroy, OnInit } from '@angular/core';
import { Payment } from '../core/rest-service/entity/payment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { User } from '../core/rest-service/entity/user';
import { selectAllUsers } from '../store/selectors/user.selector';
import { selectPaymentById } from '../store/selectors/payment.selector';


@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit, OnDestroy {

  private payment$: Observable<Payment>;
  private users$: Observable<User[]>;
  private transactionId: string;

  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.users$ = this.store.select(selectAllUsers);

    this.route.paramMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(params => {
      this.transactionId = params.get('transactionId');
    });

    // this.store.dispatch(PaymentActions.requestPaymentData({transactionId: this.transactionId}));
    this.payment$ = this.store.select(selectPaymentById(), {id: this.transactionId});
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  findUser(id: number): Observable<User> {
    return this.users$
      .pipe(
        take(1),
        map((users: User[]) => {
          return users.filter(user => user.userId === id).pop();
        })
      );
  }

}
