import { AppState } from '@app/core';
import { IList, IDetail } from 'rvw-model/lib/route'
import { ILoadingState, ILoadingDetailState } from '../core.model';

export interface RouteState extends ILoadingState {
  list: IList[];
  details: {
    [id: string]: ILoadingDetailState<IDetail, string>;
  }
}

export interface State extends AppState {
  route: RouteState;
}
