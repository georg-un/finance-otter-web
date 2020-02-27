import { Observable } from "rxjs";
import { User } from "./entity/user";
import { Payment } from "./entity/payment";

export interface FinOBackendServiceInterface {

  fetchPayments(offset: number, limit: number): Observable<Payment[]>;

  fetchPayment(paymentId: string): Observable<Payment>;

  fetchUsers(): Observable<User[]>;

  uploadNewPayment(payment: Payment): Observable<{payment: Payment, code: number, message: string}>;

  updatePayment(payment: Payment): Observable<{payment: Payment, code: number, message: string}>;

  deletePayment(paymentId: string): Observable<{paymentId: string, code: number, message: string}>;

}
