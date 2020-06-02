import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../core/entity/user';

@Component({
  selector: 'app-debit-card',
  templateUrl: './debit-card.component.html',
  styleUrls: ['./debit-card.component.scss']
})
export class DebitCardComponent implements OnInit {

  @Input() amount: number;
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
