import { StateContext } from '@ngxs/store';
import cloneDeep from 'lodash-es'

export function getClonedState<T>(ctx: StateContext<T>): T {
  return cloneDeep(ctx.getState());
}
