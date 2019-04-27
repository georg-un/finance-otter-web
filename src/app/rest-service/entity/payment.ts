import {Transaction} from "./transaction";
import {Debit} from "./debit";

export class Payment {
  transaction: Transaction;
  debits: Debit[];
}
