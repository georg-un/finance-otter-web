import { Payment } from '../entity/payment';

export const PAYMENT1: Payment =
  {
    'transaction': {
      'date': new Date(1554415200000),
      'category': 'Groceries',
      'shop': 'Bio Shop',
      'description': null,
      'billId': null,
      'userId': 1,
      'transactionId': 1,
      'username': 'alice',
      'firstName': 'Alice',
      'lastName': 'Cooper',
      'sumAmount': 40.86
    },
    'debits': [
      {
        'debitId': 1,
        'debtorId': 2,
        'debtorName': 'bob',
        'debtorFirstName': 'Bob',
        'debtorLastName': 'Ross',
        'amount': 20.43
      },
      {
        'debitId': 2,
        'debtorId': 3,
        'debtorName': 'charlie',
        'debtorFirstName': 'Charlie',
        'debtorLastName': 'Brown',
        'amount': 20.43
      }
    ]
  };
