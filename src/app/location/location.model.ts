import { Detail, IList } from 'rvw-model/lib/location'

import { AppState } from '@app/core';
import { ILoadingState, ILoadingDetailState } from '@app/core/core.model';


export interface LocationState extends ILoadingState {
  list: IList[];
  details: {
    [id: string]: ILoadingDetailState<Detail, string>;
  }
}

export interface State extends AppState {
  location: LocationState;
}
