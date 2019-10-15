import { Component, Input, OnInit } from '@angular/core';
import { MockRestService } from '../rest-service/mock-rest.service';
import { Payment } from '../rest-service/entity/payment';

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit {

  @Input() transactionId: number;
  private payment: Payment;

  constructor(private mockRestService: MockRestService) { }

  ngOnInit() {
    this.payment = this.mockRestService.fetchPayment(this.transactionId);
  }

}
