import { AppState } from '@app/core';

export interface Tour {
  id?: string;
  routeId: string;
  points: number;
  date: string;
  participantIds: string[];
}

export interface TourState {
  tours: Tour[];
}

export interface State extends AppState {
  tour: TourState;
}
