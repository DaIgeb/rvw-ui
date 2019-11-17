import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IDetail as Route, IList } from 'rvw-model/lib/route';

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
  (state: RouteState) => state.list
);

export const selectCurrentRouteRoutes = (id: string) => {
  return createSelector(
    selectRouteRoutes,
    (state: Route[]) => state.find(r => r.id === id)
  );
};

export const selectCurrentRouteDetailState = (id: string) => {
  return createSelector(
    selectRouteState,
    (state: RouteState) => state.details[id] || { id, loading: false, loaded: false, item: undefined }
  );
};
