import { EntityStateModel } from '../utils/entity-state.model';
import { Category } from '../../core/entity/category';

export interface CategoryStateModel extends EntityStateModel<Category> {
}

export const DEFAULT_CATEGORY_STATE: CategoryStateModel = {
  entities: {},
  entityIds: []
};
