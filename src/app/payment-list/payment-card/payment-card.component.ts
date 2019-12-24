import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Payment } from '../../core/rest-service/entity/payment';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss']
})
export class PaymentCardComponent implements OnInit {

  @Input() payment: Payment;
  avatar: any = 'assets/otter-avatar.jpg';

  @Output() cardClick: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick(): void {
    this.cardClick.emit(this.payment.paymentId);
  }

}
