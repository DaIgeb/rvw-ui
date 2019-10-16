import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TourState, State, Tour } from './tour.model';

export const selectTourState = createFeatureSelector<State, TourState>(
  'tour'
);

export const selectTour = createSelector(
  selectTourState,
  (state: TourState) => state
);

export const selectTourTours = createSelector(
  selectTour,
  (state: TourState) => state.tours
);

export const selectCurrentTourTours = (id: string) => {
  return createSelector(
    selectTourTours,
    (state: Tour[]) => state.find(r => r.id === id)
  );
};
