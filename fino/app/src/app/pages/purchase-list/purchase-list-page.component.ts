import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PurchaseService } from '../../services/purchase.service';
import { PurchaseCardComponent } from './purchase-card/purchase-card.component';
import { FabComponent } from '../../components/fab/fab.component';
import { RouterModule } from '@angular/router';
import { WithUid } from '../../utils/with-uid';
import { PurchaseDTO } from '../../../../../domain';

@Component({
  selector: 'app-purchase-list-page',
  templateUrl: './purchase-list-page.component.html',
  styleUrls: ['./purchase-list-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    PurchaseCardComponent,
    FabComponent,
    RouterModule,
  ]
})
export class PurchaseListPageComponent implements OnInit {
  constructor(
    public purchaseService: PurchaseService,
  ) {
  }

  ngOnInit(): void {
    this.purchaseService.requestFirstPage();
  }

  generateMonthLabel(purchase: WithUid<PurchaseDTO>): string {
    const date = new Date(purchase.date);
    return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  }

  areMonthsTheSame(purchaseA?: WithUid<PurchaseDTO>, purchaseB?: WithUid<PurchaseDTO>): boolean {
    if (!purchaseA || !purchaseB) {
      return false;
    }
    const purchaseADate = new Date(purchaseA.date);
    const purchaseBDate = new Date(purchaseB.date);
    const purchaseAMonth = `${purchaseADate.getFullYear()}-${purchaseADate.getMonth()};`;
    const purchaseBMonth = `${purchaseBDate.getFullYear()}-${purchaseBDate.getMonth()};`;
    return purchaseAMonth === purchaseBMonth;
  }
}
