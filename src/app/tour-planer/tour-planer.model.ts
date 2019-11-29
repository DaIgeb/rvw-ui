import { IList } from 'rvw-model/lib/season'

import { AppState } from '@app/core';
import { ILoadingState, ILoadingDetailState } from '@app/core/core.model';


export interface TourPlanerState extends ILoadingState {
  list: IList[];
}

export interface State extends AppState {
  "tour-planer": TourPlanerState;
}
