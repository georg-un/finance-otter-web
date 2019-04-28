import {Component, Input, OnInit} from '@angular/core';
import {Transaction} from "../rest-service/entity/transaction";

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit {

  @Input() transaction: Transaction;
  avatar: any = "assets/otter-avatar.jpg";

  constructor() {
  }

  ngOnInit() {
    // console.log(this.transaction);
  }

}
