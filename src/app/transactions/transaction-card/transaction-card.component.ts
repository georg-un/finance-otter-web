import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../../core/rest-service/entity/transaction';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit {

  @Input() transaction: Transaction;
  avatar: any = 'assets/otter-avatar.jpg';

  @Output() cardClick: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick(): void {
    this.cardClick.emit(this.transaction.transactionId);
  }

}
