import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Purchase } from '../../core/entity/purchase';
import { Debit } from "../../core/entity/debit";

@Component({
  selector: 'app-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss']
})
export class PurchaseCardComponent implements OnInit {

  @Input() purchase: Purchase;
  avatar: any = 'assets/otter-avatar.jpg';

  @Output() cardClick: EventEmitter<string> = new EventEmitter();

  debitSum: number;

  constructor() { }

  ngOnInit() {
    this.debitSum = this.purchase.debits
      .map((debit: Debit) => debit.amount)
      .reduce((sum, current) => sum + current)
  }

  onClick(): void {
    this.cardClick.emit(this.purchase.purchaseId);
  }

}
