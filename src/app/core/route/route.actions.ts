import { Action } from '@ngrx/store';
import { Route } from './route.model';

export enum RouteActionTypes {
  LOAD = '[Route] Load2',
  LOAD_SUCCESS = '[Route] Load Success',
  LOAD_FAILURE = '[Route] Load Failure',
  SAVE = '[Route] Save',
  SAVE_SUCCESS = '[Route] Save Success',
  SAVE_FAILURE = '[Route] Save Failure',
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

export class ActionRouteSave implements Action {
  readonly type = RouteActionTypes.SAVE;

  constructor(public payload: Route | Route[]) {}
}

export class ActionRouteSaveSuccess implements Action {
  readonly type = RouteActionTypes.SAVE_SUCCESS;

  constructor(public payload: Route[]) {}
}

export class ActionRouteSaveFailure implements Action {
  readonly type = RouteActionTypes.SAVE_FAILURE;

  constructor(public payload: any) {}
}

export type RouteActions =
  | ActionRouteLoad
  | ActionRouteLoadSuccess
  | ActionRouteLoadFailure
  | ActionRouteSave
  | ActionRouteSaveSuccess
  | ActionRouteSaveFailure
 ;
