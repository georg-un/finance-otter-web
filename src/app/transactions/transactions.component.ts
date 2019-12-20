import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Payment } from '../core/rest-service/entity/payment';
import { PaymentSelectors } from '../store/selectors/payment.selectors';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  payments: Payment[];
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.store.select(PaymentSelectors.selectAllPayments)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((payments: Payment[]) => {
        this.payments = payments;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onCardClick($event: string): void {
    this.router.navigateByUrl('/payment/' + $event);
  }

}
