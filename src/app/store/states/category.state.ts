import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Category } from '../../core/entity/category';

export interface CategoryState extends EntityState<Category> {
  syncJobs: number;
}

export const categoryAdapter: EntityAdapter<Category> = createEntityAdapter<Category>({
  selectId: (category: Category) => category.id
});

export function sortById(a: Category, b: Category): number {
  if (a.id > b.id) {
    return 1;
  } else if (a.id < b.id) {
    return -1;
  } else {
    return 0;
  }
}

export const initialState: CategoryState = categoryAdapter.getInitialState({
  syncJobs: 0,
  sortComparer: sortById,
});
