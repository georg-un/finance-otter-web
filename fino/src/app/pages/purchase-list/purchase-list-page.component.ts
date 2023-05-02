import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from '../../services/auth.service';
import { Purchase } from '../../model/purchase';
import { PurchaseCardComponent } from './purchase-card/purchase-card.component';

@Component({
  selector: 'app-purchase-list-page',
  templateUrl: './purchase-list-page.component.html',
  styleUrls: ['./purchase-list-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    PurchaseCardComponent,
  ]
})
export class PurchaseListPageComponent implements OnInit {
  constructor(
    public purchaseService: PurchaseService,
    public authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.purchaseService.requestFirstPage();
  }

  generateMonthLabel(purchase: Purchase): string {
    const date = new Date(purchase.date);
    return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  }

  areMonthsTheSame(purchaseA?: Purchase, purchaseB?: Purchase): boolean {
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
