import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../core/rest-service/entity/transaction';
import { Router } from "@angular/router";

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit {

  @Input() transaction: Transaction;
  avatar: any = 'assets/otter-avatar.jpg';

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  onClick(): void {
    this.router.navigateByUrl('/payment/' + this.transaction.userId);
  }

}
