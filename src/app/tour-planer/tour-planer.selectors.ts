import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TourPlanerState, State } from './tour-planer.model';

export const selectTourPlanerState = createFeatureSelector<State, TourPlanerState>('tour-planer');

export const selectTourPlanerAll = createSelector(
  selectTourPlanerState,
  (state: TourPlanerState) => state.list
);

export const selectTourPlanerIsLoading = createSelector(
  selectTourPlanerState,
  (state: TourPlanerState) => state.loading
);

export const selectTourPlanerIsLoaded = createSelector(
  selectTourPlanerState,
  (state: TourPlanerState) => state.loaded
);
