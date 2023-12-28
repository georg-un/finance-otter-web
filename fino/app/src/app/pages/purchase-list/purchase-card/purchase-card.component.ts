import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DebitSumPipe } from '../../../utils/debit-sum.pipe';
import { RouterModule } from '@angular/router';
import { WithUid } from '../../../utils/with-uid';
import { PurchaseDTO } from '../../../../../../domain';
import { UserService } from '../../../services/user.service';
import { CategoryService } from '../../../services/category.service';
import { ReplaySubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    NgOptimizedImage,
    CommonModule,
    MatCardModule,
    MatIconModule,
    DebitSumPipe,
    RouterModule,
  ]
})
export class PurchaseCardComponent {
  constructor(
    private categoryService: CategoryService,
    private userService: UserService,
  ) {
  }

  purchase$ = new ReplaySubject<WithUid<PurchaseDTO>>(1);

  category$ = this.purchase$.pipe(
    switchMap((purchase) => this.categoryService.getByUid(purchase.categoryUid))
  );

  buyer$ = this.purchase$.pipe(
    switchMap((purchase) => this.userService.getByUid(purchase.payerUid))
  );

  @Input() set purchase(val: WithUid<PurchaseDTO>) {
    this.purchase$.next(val);
  };
}
