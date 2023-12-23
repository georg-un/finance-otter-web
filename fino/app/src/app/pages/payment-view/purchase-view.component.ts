import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { PurchaseService } from '../../services/purchase.service';
import { filter } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { DebitSumPipe } from '../../utils/debit-sum.pipe';
import { User } from '../../model/user';

export const PURCHASE_ID_PATH_ID = 'id';

@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DebitSumPipe
  ]
})
export class PurchaseViewComponent {

  private readonly purchaseId$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get(PURCHASE_ID_PATH_ID)),
  );

  readonly purchase$ = this.purchaseId$.pipe(
    filter(Boolean),
    switchMap((purchaseId) => this.purchaseService.getPurchase(purchaseId)),
  );

  readonly users$ = this.userService.users$;

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private userService: UserService,
  ) {
  }

  getDebitsEntries(debits: Record<string, number>): {debtorUid: string, amount: number}[] {
    return Object.keys(debits).map((debtorUid) => ({
      debtorUid,
      amount: debits[debtorUid],
    }))
  }

  findUserByUid(uid: string, users: User[]): User | undefined {
    return users.find((user) => user.uid === uid);
  }
}
