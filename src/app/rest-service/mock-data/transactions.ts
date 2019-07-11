import {Transaction} from '../entity/transaction';

export const TRANSACTIONS: Transaction[] = [
  {
    'transactionId': 1,
    'userId': 1,
    'date': new Date(1554415200000),
    'category': 'Groceries',
    'shop': 'Bio Shop',
    'description': 'Needed stuff',
    'billId': null,
    'username': 'alice',
    'firstName': 'Alice',
    'lastName': 'Cooper',
    'sumAmount': 40.86
  },
  {
    'transactionId': 2,
    'userId': 2,
    'date': new Date(1554415200000),
    'category': 'Pets',
    'shop': 'Pet Store',
    'description': 'Bought new dog food',
    'billId': null,
    'username': 'bob',
    'firstName': 'Bob',
    'lastName': 'Ross',
    'sumAmount': 64.02
  },
  {
    'transactionId': 3,
    'userId': 3,
    'date': new Date(1554415200000),
    'category': 'Hygiene',
    'shop': 'Drugstore',
    'description': null,
    'billId': null,
    'username': 'charlie',
    'firstName': 'Charlie',
    'lastName': 'Brown',
    'sumAmount': 22.32
  }
];
