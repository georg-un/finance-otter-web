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
