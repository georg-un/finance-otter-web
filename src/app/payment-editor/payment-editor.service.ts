import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentEditorService {

  addPaymentTrigger: Subject<boolean> = new Subject();

  constructor() { }

  emitAddPaymentTrigger(): void {
    this.addPaymentTrigger.next(true);
  }

}
