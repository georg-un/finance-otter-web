export class Debit {
  debitId: string;
  debtorId: string;
  amount: number;

  constructor(input?: any) {
    if (input) {
      this.debitId = input.debitId;
      this.debtorId = input.debtorId;
      this.amount = input.amount;
    }
  }

}
