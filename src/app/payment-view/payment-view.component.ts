import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Payment } from '../core/rest-service/entity/payment';
import { Store } from "@ngrx/store";
import * as CoreActions from '../store/actions/core.actions';
import { selectPayment, selectUsers } from "../store/selectors/core.selectors";
import { AppState } from "../store/states/app.state";
import { Observable, Subject } from "rxjs";
import { map, take, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { User } from "../core/rest-service/entity/user";

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit, OnDestroy {

  private payment$: Observable<Payment>;
  private users$: Observable<User[]>;
  private transactionId: number;

  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.users$ = this.store.select(selectUsers);

    this.route.paramMap.subscribe(params => {
      this.transactionId = parseInt(params.get('transactionId'));
    });

    this.store.dispatch(CoreActions.requestPaymentData({transactionId: this.transactionId}));
    this.payment$ = this.store.select(selectPayment)
      .pipe(takeUntil(this.onDestroy$));
  }

  ngOnDestroy(): void {
    this.store.dispatch(CoreActions.clearPaymentData());
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
