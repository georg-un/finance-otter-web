import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Purchase } from '../../core/entity/purchase';
import { Debit } from '../../core/entity/debit';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { Observable } from 'rxjs';
import { UserSelectors } from '../../store/selectors/user.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss']
})
export class PurchaseCardComponent implements OnInit {

  @Input() purchase: Purchase;
  buyerAvatarUrl$: Observable<string>;
  receiverAvatarUrl$?: Observable<string>;

  @Output() cardClick: EventEmitter<string> = new EventEmitter();

  debitSum: number;

  constructor(
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    // Calculate total amount
    this.debitSum = this.purchase.debits
      .map((debit: Debit) => debit.amount)
      .reduce((sum, current) => sum + current);
    // Get buyer avatar
    this.buyerAvatarUrl$ = this.store.select(UserSelectors.selectUserById(), {id: this.purchase.buyerId})
      .pipe(map(user => user.avatarUrl));
    // If transaction is a compensation, get receiver avatar
    if (this.purchase.isCompensation) {
      this.receiverAvatarUrl$ = this.store.select(UserSelectors.selectUserById(), {id: this.purchase.debits[0].debtorId})
        .pipe(map(user => user.avatarUrl));
    }
  }

  onClick(): void {
    this.cardClick.emit(this.purchase.purchaseId);
  }

}
