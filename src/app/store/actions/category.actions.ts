import { createAction, props } from '@ngrx/store';
import { Category } from '../../core/entity/category';

export class CategoryActions {
  static requestCategories = createAction('[Category] Request Categories');
  static categoriesReceived = createAction('[Category] Categorys Received', props<{categories: Category[]}>());
}
