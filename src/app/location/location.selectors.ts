import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LocationState, State, Location } from './location.model';

export const selectLocationState = createFeatureSelector<State, LocationState>('location');

export const selectLocationAll = createSelector(
  selectLocationState,
  (state: LocationState) => state.locations
);

export const selectLocationById = (id: string) => {
  return createSelector(
    selectLocationAll,
    (state: Location[]) => state.find(r => r.id === id)
  );
};

