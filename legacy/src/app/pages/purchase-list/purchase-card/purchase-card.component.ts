import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Purchase } from '../../../core/entity/purchase';
import { Debit } from '../../../core/entity/debit';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { User } from '../../../core/entity/user';
import { Category } from '../../../core/entity/category';
import { Store } from '@ngxs/store';
import { UserState } from '../../../store/user/user.state';
import { CategoryState } from 'src/app/store/category/category.state';

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
    switchMap((purchase: Purchase) => this.store.select(UserState.selectUserById(purchase.buyerId))),
    filter(Boolean),
    map((user: User) => user.avatarUrl),
    shareReplay(1)
  );

  public receiverAvatarUrl$?: Observable<string> = this.purchase$.pipe(
    filter((purchase: Purchase) => purchase?.isCompensation),
    switchMap((purchase: Purchase) => this.store.select(UserState.selectUserById(purchase.debits[0].debtorId))),
    filter(Boolean),
    map((user: User) => user.avatarUrl),
    shareReplay(1)
  );

  public category$: Observable<Category> = this.purchase$.pipe(
    filter(Boolean),
    switchMap((purchase: Purchase) => this.store.select(CategoryState.selectCategoryById(purchase.categoryId)))
  );

  public debitSum$: Observable<number> = this.purchase$.pipe(
    map(purchase => purchase.debits
      .map((debit: Debit) => debit.amount)
      .reduce((sum, current) => sum + current)
    ));

  constructor(
    private store: Store
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
