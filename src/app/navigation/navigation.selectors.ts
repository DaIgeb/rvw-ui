import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NavigationState, State } from './navigation.model';

export const selectNavigationState = createFeatureSelector<State, NavigationState>(
  'navigation'
);

export const selectNavigation = createSelector(
  selectNavigationState,
  (state: NavigationState) => state
);

export const selectNavigationShowSidebar = createSelector(
  selectNavigation,
  (state: NavigationState) => state.showSideBar
);
