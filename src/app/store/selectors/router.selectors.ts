import * as fromRouter from '@ngrx/router-store';
import { AppState } from '../states/app.state';

const selectRouter = (state: AppState) => state.router;

const {
  selectQueryParams,    // select the current route query params
  selectQueryParam,     // factory function to select a query param
  selectRouteParams,    // select the current route params
  selectRouteParam,     // factory function to select a route param
  selectRouteData,      // select the current route data
  selectUrl,            // select the current url
} = fromRouter.getSelectors(selectRouter);

export class RouterSelectors {
  static selectPurchaseId = selectRouteParam('purchaseId');
  // static selectStatus = selectQueryParam('status');
  static selectCurrentUrl = selectUrl;
}
