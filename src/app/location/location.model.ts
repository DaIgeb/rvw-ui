import { AppState } from '@app/core';

interface Position {
  type: 'position';
}
interface Restaurant {
  type: 'restaurant';
  timelines: {
    from: string;
    until?: string;
    notes?: string;
    phone?: string;
    businessHours: {
      from: string;
      until: string;
      weekday:
        | 'Monday'
        | 'Tuesday'
        | 'Wednesday'
        | 'Thursday'
        | 'Friday'
        | 'Saturday'
        | 'Sunday';
    }[];
  }[];
}

export type Location = {
  id: string;
  name: string;
  street?: number;
  country?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  longitude: number;
  latitude: number;
} & (Restaurant | Position);

export interface LocationState {
  locations: Location[];
}

export interface State extends AppState {
  location: LocationState;
}
