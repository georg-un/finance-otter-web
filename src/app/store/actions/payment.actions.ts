import { createAction, props } from '@ngrx/store';
import { Payment } from '../../core/rest-service/entity/payment';
import { Update } from '@ngrx/entity';

export const addPayment = createAction('[Payment] Add Payment', props<{ payment: Payment }>());
export const addPayments = createAction('[Payment] Add Payments', props<{ payments: Payment[] }>());
export const replacePayments = createAction('[Payment] Replace Payments', props<{ payments: Payment[] }>());
export const updatePayment = createAction('[Payment] Update Payment', props<{ payment: Update<Payment> }>());
export const updatePayments = createAction('[Payment] Update Payments', props<{ payments: Update<Payment>[] }>());
export const clearPayments = createAction('[Payment] Clear Payment');

export const requestPayments = createAction('[Payment] Request Payments', props<{offset: number, limit: number}>());
export const paymentsReceived = createAction('[Payment] Transaction Data Received', props<{payments: Payment[]}>());
export const requestSinglePayment = createAction('[Payment] Request Single Payment', props<{paymentId: string}>());
export const singlePaymentReceived = createAction('[Payment] Single Payment Received', props<{payment: Payment}>());
export const addNewPayment = createAction('[Payment] Add New Payment', props<{payment: Payment}>());
export const paymentUploadSuccessful = createAction('[Payment] Payment Upload Successful', props<{payment: Update<Payment>}>());
export const paymentUploadFailed = createAction('[Payment] Payment Upload Failed', props<{payment: Update<Payment>}>());
