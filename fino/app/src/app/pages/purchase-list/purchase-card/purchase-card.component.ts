import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Purchase } from '../../../model/purchase';
import { User } from '../../../model/user';
import { DebitSumPipe } from '../../../utils/debit-sum.pipe';
import { RouterModule } from '@angular/router';

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
  @Input() buyer!: User;

  constructor(private changeDetection: ChangeDetectorRef) {
  }

  private _purchase!: Purchase;

  get purchase(): Purchase {
    return this._purchase;
  }

  @Input() set purchase(val: Purchase) {
    this._purchase = val;
    this.changeDetection.detectChanges();
  };
}
