import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromPurchases from './reducers/purchase.reducer';
import * as fromUsers from './reducers/user.reducer';
import * as fromLayout from './reducers/layout.reducer';
import { AppState } from './states/app.state';
import { routerReducer } from '@ngrx/router-store';

export const reducers: ActionReducerMap<AppState> = {
  users: fromUsers.reducer,
  purchases: fromPurchases.reducer,
  layout: fromLayout.reducer,
  router: routerReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
