import { User } from '../core/entity/user';

export const USER_MOCK_1: User = {
  userId: 'user1',
  firstName: 'Anna',
  lastName: 'Adler',
  avatarUrl: '',
  deactivated: false
}

export const USER_MOCK_2: User = {
  userId: 'user2',
  firstName: 'Berndt',
  lastName: 'Bieber',
  avatarUrl: '',
  deactivated: false,
}

export const USER_MOCK_3: User = {
  userId: 'user3',
  firstName: 'Claudia',
  lastName: 'Chamäleon',
  avatarUrl: '',
  deactivated: false
}

export const USER_LIST_MOCK = [
  USER_MOCK_1,
  USER_MOCK_2,
  USER_MOCK_3
];
