import { AppState } from '@app/core';

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
}

export interface State extends AppState {
  tour: TourState;
}
