import { Component, Input, OnInit } from '@angular/core';
import { Debit } from '../../core/rest-service/entity/debit';
import { User } from "../../core/rest-service/entity/user";

@Component({
  selector: 'app-debit-card',
  templateUrl: './debit-card.component.html',
  styleUrls: ['./debit-card.component.scss']
})
export class DebitCardComponent implements OnInit {

  @Input() debit: Debit;
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
