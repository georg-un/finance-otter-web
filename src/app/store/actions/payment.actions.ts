import { createAction, props } from '@ngrx/store';
import { Payment } from '../../core/rest-service/entity/payment';
import { Update } from '@ngrx/entity';

export class PaymentActions {
  static addPaymentEntity = createAction('[Payment] Add Payment Entity', props<{ payment: Payment }>());
  static addPaymentEntities = createAction('[Payment] Add Payment Entities', props<{ payments: Payment[] }>());
  static replacePaymentEntities = createAction('[Payment] Replace Payment Entities', props<{ payments: Payment[] }>());
  static updatePaymentEntity = createAction('[Payment] Update Payment Entity', props<{ payment: Update<Payment> }>());
  static updatePaymentEntities = createAction('[Payment] Update Payment Entities', props<{ payments: Update<Payment>[] }>());
  static clearPaymentEntities = createAction('[Payment] Remove Payment Entity');

  static requestPayments = createAction('[Payment] Request Payments', props<{offset: number, limit: number}>());
  static paymentsReceived = createAction('[Payment] Payments Received', props<{payments: Payment[]}>());
  static requestSinglePayment = createAction('[Payment] Request Single Payment', props<{paymentId: string}>());
  static singlePaymentReceived = createAction('[Payment] Single Payment Received', props<{payment: Payment}>());
  static addNewPayment = createAction('[Payment] Add New Payment', props<{payment: Payment}>());
  static updatePayment = createAction('[Payment] Update Payment', props<{payment: Payment}>());
  static deletePayment = createAction('[Payment] Delete Payment', props<{payment: Payment}>());
  static paymentUploadSuccessful = createAction('[Payment] Payment Upload Successful', props<{payment: Payment}>());
  static paymentUploadFailed = createAction('[Payment] Payment Upload Failed', props<{paymentId: string}>());
  static paymentUpdateSuccessful = createAction('[Payment] Payment Update Successful', props<{payment: Payment}>());
  static paymentUpdateFailed = createAction('[Payment] Payment Update Failed', props<{paymentId: string}>());
  static paymentDeleteSuccessful = createAction('[Payment] Payment Delete Successful', props<{paymentId: string}>());
  static paymentDeleteFailed = createAction('[Payment] Payment Delete Failed', props<{payment: Payment}>());
  static syncPayments = createAction('[Payment] Sync Payment');
}
