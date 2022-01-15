import { User } from '../core/entity/user';

export const USER_MOCK_1 = new User();
USER_MOCK_1.userId = 'user1';
USER_MOCK_1.firstName = 'Anna';
USER_MOCK_1.lastName = 'Adler';
USER_MOCK_1.avatarUrl = '';
USER_MOCK_1.deactivated = false;

export const USER_MOCK_2 = new User();
USER_MOCK_2.userId = 'user2';
USER_MOCK_2.firstName = 'Berndt';
USER_MOCK_2.lastName = 'Bieber';
USER_MOCK_2.avatarUrl = '';
USER_MOCK_2.deactivated = false;

export const USER_MOCK_3 = new User();
USER_MOCK_3.userId = 'user3';
USER_MOCK_3.firstName = 'Claudia';
USER_MOCK_3.lastName = 'Chamäleon';
USER_MOCK_3.avatarUrl = '';
USER_MOCK_3.deactivated = false;

export const USER_LIST_MOCK = [
  USER_MOCK_1,
  USER_MOCK_2,
  USER_MOCK_3
];
