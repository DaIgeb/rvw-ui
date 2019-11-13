import { AppState } from '@app/core';

import { Detail, List } from 'rvw-model/lib/location'

export interface LocationState {
  list: List[];
  details: { [id: string]: Detail; }
}

export interface State extends AppState {
  location: LocationState;
}
