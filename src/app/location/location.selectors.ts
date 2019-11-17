import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Detail } from 'rvw-model/lib/location'

import { LocationState, State } from './location.model';
import { ILoadingDetailState } from '@app/core/core.model';

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
    (state: ILoadingDetailState<Detail, string>) => state ? state.item : undefined
  );
};

