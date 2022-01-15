import { Category } from '../core/entity/category';

export const CATEGORY_MOCK_1 = new Category();
CATEGORY_MOCK_1.id = 1;
CATEGORY_MOCK_1.label = 'Category One';
CATEGORY_MOCK_1.color = 'red';

export const CATEGORY_MOCK_2 = new Category();
CATEGORY_MOCK_2.id = 2;
CATEGORY_MOCK_2.label = 'Category Two';
CATEGORY_MOCK_2.color = 'green';

export const CATEGORY_MOCK_3 = new Category();
CATEGORY_MOCK_3.id = 3;
CATEGORY_MOCK_3.label = 'Category Three';
CATEGORY_MOCK_3.color = 'blue';

export const CATEGORY_LIST_MOCK = [
  CATEGORY_MOCK_1,
  CATEGORY_MOCK_2,
  CATEGORY_MOCK_3
];
