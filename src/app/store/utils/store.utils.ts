import { StateContext } from '@ngxs/store';
import cloneDeep from 'lodash-es';
import { Dictionary, EntityStateModel } from './entity-state.model';

export function getClonedState<T>(ctx: StateContext<T>): T {
  return cloneDeep(ctx.getState());
}

export function setSingleStateProperty<T>(ctx: StateContext<T>, property: keyof T, value: T[keyof T]): T {
  const newState = getClonedState(ctx);
  newState[property] = value;
  return ctx.setState(newState);
}

/**
 * Set an entity state. This overwrites the previous entity state.
 * @param ctx           State context
 * @param entities      Entities to add to the state
 * @param idProperty    Name of the ID property of the respective entity
 */
export function setEntityState<T, S extends EntityStateModel<T>>(ctx: StateContext<S>, entities: T[], idProperty: keyof T & string): S {
  const prop = idProperty as string;  // required to make the TS compiler happy
  // remove duplicates (by id-property)
  entities = [...new Map(entities.map(item => [item[prop], item])).values()];
  // set the state
  const newState = getClonedState(ctx);
  newState.entityIds = entities.map(entity => entity[prop]);
  newState.entities = entities.reduce((acc: Dictionary<T>, cur: T) => ({...acc, [cur[prop]]: cur}), {});
  return ctx.setState(newState);
}

/**
 * Update an entity state. Old entities are kept in the state and new entities are added.
 * @param ctx           State context
 * @param entities      New entities to add to the state
 * @param idProperty    Name of the ID property of the respective entity
 * @param sortFn        An optional compare function used to sort all entities before updating the state
 */
export function updateEntityState<T, S extends EntityStateModel<T>>(
  ctx: StateContext<S>,
  entities: T[],
  idProperty: keyof T & string,
  sortFn?: (a: T, b: T) => number
  ): S {
  // combine old & new entities
  const oldEntities = Object.values(ctx.getState().entities || {});
  let allEntities = [...oldEntities, ...entities];
  // sort the entities
  allEntities = sortFn ? allEntities.sort(sortFn) : allEntities;
  return setEntityState(ctx, allEntities, idProperty);
}
