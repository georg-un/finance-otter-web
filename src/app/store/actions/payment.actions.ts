import { createAction, props } from '@ngrx/store';
import { Payment } from '../../core/rest-service/entity/payment';
import { Update } from '@ngrx/entity';

export class PaymentActions {
  static addPayment = createAction('[Payment] Add Payment', props<{ payment: Payment }>());
  static addPayments = createAction('[Payment] Add Payments', props<{ payments: Payment[] }>());
  static replacePayments = createAction('[Payment] Replace Payments', props<{ payments: Payment[] }>());
  static updatePayment = createAction('[Payment] Update Payment', props<{ payment: Update<Payment> }>());
  static updatePayments = createAction('[Payment] Update Payments', props<{ payments: Update<Payment>[] }>());
  static clearPayments = createAction('[Payment] Clear Payment');

  static requestPayments = createAction('[Payment] Request Payments', props<{offset: number, limit: number}>());
  static paymentsReceived = createAction('[Payment] Transaction Data Received', props<{payments: Payment[]}>());
  static requestSinglePayment = createAction('[Payment] Request Single Payment', props<{paymentId: string}>());
  static singlePaymentReceived = createAction('[Payment] Single Payment Received', props<{payment: Payment}>());
  static addNewPayment = createAction('[Payment] Add New Payment', props<{payment: Payment}>());
  static paymentUploadSuccessful = createAction('[Payment] Payment Upload Successful', props<{payment: Update<Payment>}>());
  static paymentUploadFailed = createAction('[Payment] Payment Upload Failed', props<{payment: Update<Payment>}>());
  static syncPayments = createAction('[Payment] Sync Payment');
}
