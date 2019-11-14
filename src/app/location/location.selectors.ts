import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Detail, List } from 'rvw-model/lib/location'

import { LocationState, State, ILoadingState } from './location.model';

export const selectLocationState = createFeatureSelector<State, LocationState>('location');

export const selectLocationAll = createSelector(
  selectLocationState,
  (state: LocationState) => state.list
);

export const selectLocationIsLoading = createSelector(
  selectLocationState,
  (state: LocationState) => state.loading
);

export const selectLocationIsLoaded = createSelector(
  selectLocationState,
  (state: LocationState) => state.loaded
);

export const selectLocationByIdState = (id: string) => {
  return createSelector(
    selectLocationState,
    (state: LocationState) => ({
      loaded: false,
      loading: false,
      item: undefined,
      id,
      ...state.details[id]
    })
  );
};

export const selectLocationById = (id: string) => {
  return createSelector(
    selectLocationByIdState(id),
    (state: ILoadingState & { item: Detail }) => state ? state.item : undefined
  );
};

