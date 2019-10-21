import { AppState } from '@app/core';
import { Sort } from '@angular/material/sort';

export interface Tour {
  id?: string;
  route: string;
  points: number;
  date: string;
  participants: string[];
}

export interface TourState {
  tours: Tour[];
  year: number;
  loading: boolean;
  loaded: boolean;
  list: {
    sort: Sort[];
  };
}

export interface State extends AppState {
  tour: TourState;
}
