import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Detail as Location } from 'rvw-model/lib/location'

import { LocationState, State } from './location.model';

export const selectLocationState = createFeatureSelector<State, LocationState>('location');

export const selectLocationAll = createSelector(
  selectLocationState,
  (state: LocationState) => state.list
);

export const selectLocationById = (id: string) => {
  return createSelector(
    selectLocationAll,
    (state: Location[]) => state.find(r => r.id === id)
  );
};

