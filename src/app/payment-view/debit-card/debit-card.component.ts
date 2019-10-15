import { Component, Input, OnInit } from '@angular/core';
import { Debit } from '../../rest-service/entity/debit';

@Component({
  selector: 'app-debit-card',
  templateUrl: './debit-card.component.html',
  styleUrls: ['./debit-card.component.scss']
})
export class DebitCardComponent implements OnInit {

  @Input() debit: Debit;

  constructor() { }

  ngOnInit() {
  }

}
