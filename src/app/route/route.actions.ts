import { Action } from '@ngrx/store';
import { Route } from './route.model';

export enum RouteActionTypes {
  LOAD = '[Route] Load',
  LOAD_SUCCESS = '[Route] Load Success',
  LOAD_FAILURE = '[Route] Load Failure',
  SAVE = '[Route] Save',
  SAVE_SUCCESS = '[Route] Save Success',
  SAVE_FAILURE = '[Route] Save Failure',
  BATCH_SAVE = '[Route] BATCH_SAVE',
  BATCH_SAVE_SUCCESS = '[Route] BATCH_SAVE Success',
  BATCH_SAVE_FAILURE = '[Route] BATCH_SAVE Failure',
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

  constructor(public payload: Route) {}
}

export class ActionRouteSaveSuccess implements Action {
  readonly type = RouteActionTypes.SAVE_SUCCESS;

  constructor(public payload: Route) {}
}

export class ActionRouteSaveFailure implements Action {
  readonly type = RouteActionTypes.SAVE_FAILURE;

  constructor(public payload: any) {}
}


export class ActionRouteBatchSave implements Action {
  readonly type = RouteActionTypes.BATCH_SAVE;

  constructor(public payload: Route[]) {}
}

export class ActionRouteBatchSaveSuccess implements Action {
  readonly type = RouteActionTypes.BATCH_SAVE_SUCCESS;

  constructor(public payload: Route[]) {}
}

export class ActionRouteBatchSaveFailure implements Action {
  readonly type = RouteActionTypes.BATCH_SAVE_FAILURE;

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
