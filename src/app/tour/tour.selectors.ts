import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TourState, State, Tour } from './tour.model';

export const selectTourState = createFeatureSelector<State, TourState>('tour');

export const selectTourLoading = createSelector(
  selectTourState,
  (state: TourState) => state.loading
);

export const selectTourTours = createSelector(
  selectTourState,
  (state: TourState) => state.tours
);

export const selectTourToursTour = (id: string) => {
  return createSelector(
    selectTourTours,
    (state: Tour[]) => state.find(r => r.id === id)
  );
};

export const selectTourYear = createSelector(
  selectTourState,
  state => state.year
);


export const selectTourListSort = createSelector(
  selectTourState,
  state => state.list.sort
);

