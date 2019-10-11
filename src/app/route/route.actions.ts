import { Action } from '@ngrx/store';
import { Route } from './route.model';

export enum RouteActionTypes {
  LOAD = '[Route] Load',
  LOAD_SUCCESS = '[Route] Load Success',
  LOAD_FAILURE = '[Route] Load Failure',
}

export class ActionRouteLoad implements Action {
  readonly type = RouteActionTypes.LOAD;
}

export class ActionRouteLoadSuccess implements Action {
  readonly type = RouteActionTypes.LOAD_SUCCESS;

  constructor(public payload: Route[]) {}
}

export class ActionRouteLoadFailure implements Action {
  readonly type = RouteActionTypes.LOAD_FAILURE;

  constructor(public payload: any) {}
}

export type RouteActions =
  | ActionRouteLoad
  | ActionRouteLoadSuccess
  | ActionRouteLoadFailure
 ;
