import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DebitSumPipe } from '../../utils/debit-sum.pipe';
import { WithUid } from '../../utils/with-uid';
import { CategoryDTO, PurchaseDTO, UserDTO } from '../../../../../domain';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DebitSumPipe,
    RouterModule
  ]
})
export class PurchaseDetailsComponent {

  @Input() purchase!: WithUid<PurchaseDTO>;

  @Input() users!: WithUid<UserDTO>[];

  @Input() category!: WithUid<CategoryDTO>;

  getDebitsEntries(debits: Record<string, number>): { debtorUid: string, amount: number }[] {
    return Object.keys(debits).map((debtorUid) => ({
      debtorUid,
      amount: debits[debtorUid],
    }));
  }

  findUserByUid(uid: string, users: WithUid<UserDTO>[]): WithUid<UserDTO> | undefined {
    return users.find((user) => user.uid === uid);
  }
}
