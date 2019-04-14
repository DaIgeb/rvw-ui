import { createSelector } from '@ngrx/store';

import { selectLayoutState } from '../core.state';
import { LayoutState } from './layout.models';

export const selectLayout = createSelector(
  selectLayoutState,
  (state: LayoutState) => state
);

export const selectIsSideNavShown = createSelector(
  selectLayout,
  s => s.showSideNav
);
