import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';
import { RouterSelectors } from "./router.selectors";
import { LeftButtonIconEnum, RightButtonIconEnum } from "../../layout/header/button-enums";
import { PurchaseSelectors } from "./purchase.selectors";

const selectLayout = (state: AppState) => state.layout;

export class LayoutSelectors {

  static isSidenavOpen = createSelector(selectLayout, state => state.sidenavOpen);
  static selectPagination = createSelector(selectLayout, state => state.pagination);

  static selectFAB = createSelector(
    RouterSelectors.selectCurrentUrl,
    (url: string) => deriveLayoutFromUrl(url).fab
  );

  static selectFABLink = createSelector(
    RouterSelectors.selectCurrentUrl,
    (url: string) => deriveLayoutFromUrl(url).fabLink
  );

  static selectLeftHeaderButton = createSelector(
    RouterSelectors.selectCurrentUrl,
    (url: string) => deriveLayoutFromUrl(url).leftHeaderButton
  );

  static selectRightHeaderButton = createSelector(
    RouterSelectors.selectCurrentUrl,
    (url: string) => deriveLayoutFromUrl(url).rightHeaderButton
  );

  static showLogo = createSelector(
    RouterSelectors.selectCurrentUrl,
    (url: string) => deriveLayoutFromUrl(url).showLogo
  );

  static shouldSyncIconRotate = createSelector(
    LayoutSelectors.selectRightHeaderButton,
    PurchaseSelectors.selectSyncJobs,
    (rightHeaderButton: RightButtonIconEnum, syncJobs: number) => {
      return syncJobs > 0 && rightHeaderButton === RightButtonIconEnum.Sync;
    }
  )

}


function deriveLayoutFromUrl(url: string): Layout {
  const layout = new Layout();
  if (url.startsWith('/overview') || url.startsWith('/summary')) {
    layout.fab = 'add';
    layout.fabLink = '/scan-receipt';
    layout.leftHeaderButton = LeftButtonIconEnum.Menu;
    layout.rightHeaderButton = RightButtonIconEnum.Sync;
    layout.showLogo = true;
  } else if (url.startsWith('/purchase')) {
    layout.fab = 'edit';
    layout.fabLink = '/edit/' + url.split('/')[2];
    layout.leftHeaderButton = LeftButtonIconEnum.Back;
    layout.rightHeaderButton = RightButtonIconEnum.Sync;
    layout.showLogo = false;
  } else if (url.startsWith('/new') || url.startsWith('/edit')) {
    layout.fab = null;
    layout.fabLink = '/';
    layout.leftHeaderButton = LeftButtonIconEnum.Clear;
    layout.rightHeaderButton = RightButtonIconEnum.Done;
    layout.showLogo = false;
  } else {  // fallback
    layout.fab = null;
    layout.fabLink = '/';
    layout.leftHeaderButton = LeftButtonIconEnum.Menu;
    layout.rightHeaderButton = RightButtonIconEnum.Sync;
    layout.showLogo = true;
  }
  return layout;
}

class Layout {
  fab: string;
  fabLink: string;
  leftHeaderButton: LeftButtonIconEnum;
  rightHeaderButton: RightButtonIconEnum;
  showLogo: boolean;
}
