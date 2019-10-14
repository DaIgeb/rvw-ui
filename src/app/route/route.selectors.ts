import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RouteState, State } from './route.model';

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

export const selectCurrentRouteRoutes = (id: string): Route => createSelector(
  selectRoute,
  (state: RouteState) => state.routes.find(r => r.id === id)
);
