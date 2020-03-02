import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Purchase } from '../core/entity/purchase';
import { PurchaseSelectors } from '../store/selectors/purchase.selectors';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit, OnDestroy {

  purchases: Purchase[];
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.store.select(PurchaseSelectors.selectAllPurchases)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((purchases: Purchase[]) => {
        this.purchases = purchases;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onCardClick($event: string): void {
    this.router.navigateByUrl('/purchase/' + $event);
  }

}
