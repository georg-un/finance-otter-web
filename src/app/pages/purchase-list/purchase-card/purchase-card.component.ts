import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Purchase } from '../../../core/entity/purchase';
import { Debit } from '../../../core/entity/debit';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/states/app.state';
import { Observable, ReplaySubject } from 'rxjs';
import { UserSelectors } from '../../../store/selectors/user.selectors';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { User } from '../../../core/entity/user';
import { Category } from '../../../core/entity/category';
import { CategorySelectors } from '../../../store/selectors/category.selectors';

@Component({
  selector: 'app-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseCardComponent {

  private _purchase: ReplaySubject<Purchase> = new ReplaySubject<Purchase>(1);
  @Input()
  public set purchase(val: Purchase) {
    this._purchase.next(val);
  }

  @Output()
  public cardClick: EventEmitter<string> = new EventEmitter();

  public purchase$: Observable<Purchase> = this._purchase.asObservable();

  public buyerAvatarUrl$: Observable<string> = this.purchase$.pipe(
    filter(Boolean),
    switchMap((purchase: Purchase) => this.store.select(UserSelectors.selectUserById(), {id: purchase.buyerId})),
    filter(Boolean),
    map((user: User) => user.avatarUrl),
    shareReplay(1)
  );

  public receiverAvatarUrl$?: Observable<string> = this.purchase$.pipe(
    filter((purchase: Purchase) => purchase?.isCompensation),
    switchMap((purchase: Purchase) => this.store.select(UserSelectors.selectUserById(), {id: purchase.debits[0].debtorId})),
    filter(Boolean),
    map((user: User) => user.avatarUrl),
    shareReplay(1)
  );

  public category$: Observable<Category> = this.purchase$.pipe(
    filter(Boolean),
    switchMap((purchase: Purchase) => this.store.select(CategorySelectors.selectCategoryById(purchase.categoryId)))
  );

  public debitSum$: Observable<number> = this.purchase$.pipe(
    map(purchase => purchase.debits
      .map((debit: Debit) => debit.amount)
      .reduce((sum, current) => sum + current)
    ));

  constructor(
    private store: Store<AppState>
  ) {
  }

  onClick(): void {
    this._purchase
      .pipe((take(1)))
      .subscribe((purchase: Purchase) => {
        this.cardClick.emit(purchase.purchaseId);
      });
  }
}
