import { CoreState } from "./core.state";
import { LayoutState } from "./layout.state";

export interface AppState {
  core: CoreState,
  layout: LayoutState
}
