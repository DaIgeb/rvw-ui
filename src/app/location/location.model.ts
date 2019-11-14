import { AppState } from '@app/core';

import { Detail, List } from 'rvw-model/lib/location'

export interface ILoadingState {
  loaded: boolean;
  loading: boolean;
}

export interface LocationState extends ILoadingState {
  list: List[];
  details: { [id: string]: ILoadingState & {
    item: Detail | undefined
  }; }
}

export interface State extends AppState {
  location: LocationState;
}
