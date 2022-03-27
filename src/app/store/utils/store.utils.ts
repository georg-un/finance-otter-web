import { StateContext } from '@ngxs/store';
import cloneDeep from 'lodash-es'

export function getClonedState<T>(ctx: StateContext<T>): T {
  return cloneDeep(ctx.getState());
}

export function updateSingleStateProperty<T>(ctx: StateContext<T>, property: keyof T, value: T[keyof T]): T {
  const newState = getClonedState(ctx);
  newState[property] = value;
  return ctx.setState(newState);
}
