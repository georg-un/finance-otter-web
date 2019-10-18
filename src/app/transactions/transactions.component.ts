import { Component, OnInit } from '@angular/core';
import { MockRestService } from '../core/rest-service/mock-rest.service';
import { Transaction } from '../core/rest-service/entity/transaction';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[];

  constructor(private mockRestService: MockRestService) {
    this.transactions = this.mockRestService.fetchTransactions();
  }

  ngOnInit() {
  }

}
