import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCore from "./reducers/core.reducer";
import { AppState } from "./app.state";

export const reducers: ActionReducerMap<AppState> = {
  core: fromCore.reducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
