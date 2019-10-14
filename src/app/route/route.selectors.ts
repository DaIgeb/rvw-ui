import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RouteState, State, Route } from './route.model';

export const selectRouteState = createFeatureSelector<State, RouteState>(
  'route'
);

export const selectRoute = createSelector(
  selectRouteState,
  (state: RouteState) => state
);

export const selectRouteRoutes = createSelector(
  selectRoute,
  (state: RouteState) => state.routes
);

export const selectCurrentRouteRoutes = (id: string) => {
  return createSelector(
    selectRouteRoutes,
    (state: Route[]) => state.find(r => r.id === id)
  );
};
