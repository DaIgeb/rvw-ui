import { Action } from '@ngrx/store';
import { IDetail, IList, ITimeline } from 'rvw-model/lib/route';

export enum RouteActionTypes {
  LOAD = '[Route] Load',
  LOAD_SUCCESS = '[Route] Load Success',
  LOAD_FAILURE = '[Route] Load Failure',
  LOAD_DETAIL = '[Route] Load detail',
  LOAD_DETAIL_SUCCESS = '[Route] Load detail Success',
  LOAD_DETAIL_FAILURE = '[Route] Load detail Failure',
  SAVE = '[Route] Save',
  SAVE_SUCCESS = '[Route] Save Success',
  SAVE_FAILURE = '[Route] Save Failure',
  SAVE_FILE = '[Route] Save File',
  SAVE_FILE_SUCCESS = '[Route] Save File Success',
  SAVE_FILE_FAILURE = '[Route] Save File Failure',
}

export class ActionRouteLoad implements Action {
  readonly type = RouteActionTypes.LOAD;
}

export class ActionRouteLoadSuccess implements Action {
  readonly type = RouteActionTypes.LOAD_SUCCESS;

  constructor(public payload: IList[]) { }
}

export class ActionRouteLoadFailure implements Action {
  readonly type = RouteActionTypes.LOAD_FAILURE;

  constructor(public payload: any) { }
}

export class ActionRouteLoadDetail implements Action {
  readonly type = RouteActionTypes.LOAD_DETAIL;

  constructor(public payload: string) { }
}

export class ActionRouteLoadDetailSuccess implements Action {
  readonly type = RouteActionTypes.LOAD_DETAIL_SUCCESS;

  constructor(public payload: IDetail) { }
}

export class ActionRouteLoadDetailFailure implements Action {
  readonly type = RouteActionTypes.LOAD_DETAIL_FAILURE;

  constructor(public payload: any) { }
}

export class ActionRouteSave implements Action {
  readonly type = RouteActionTypes.SAVE;

  constructor(public payload: IDetail | IDetail[]) { }
}

export class ActionRouteSaveSuccess implements Action {
  readonly type = RouteActionTypes.SAVE_SUCCESS;

  constructor(public payload: IDetail[]) { }
}

export class ActionRouteSaveFailure implements Action {
  readonly type = RouteActionTypes.SAVE_FAILURE;

  constructor(public payload: any) { }
}

export class ActionRouteSaveFile implements Action {
  readonly type = RouteActionTypes.SAVE_FILE;

  constructor(public payload: { file: File, id: string, timeline: ITimeline }) { }
}

export class ActionRouteSaveFileSuccess implements Action {
  readonly type = RouteActionTypes.SAVE_FILE_SUCCESS;

  constructor(public payload: IDetail) { }
}

export class ActionRouteSaveFileFailure implements Action {
  readonly type = RouteActionTypes.SAVE_FILE_FAILURE;

  constructor(public payload: any) { }
}

export type RouteActions =
  | ActionRouteLoad
  | ActionRouteLoadSuccess
  | ActionRouteLoadFailure
  | ActionRouteLoadDetail
  | ActionRouteLoadDetailSuccess
  | ActionRouteLoadDetailFailure
  | ActionRouteSave
  | ActionRouteSaveSuccess
  | ActionRouteSaveFailure
  | ActionRouteSaveFile
  | ActionRouteSaveFileSuccess
  | ActionRouteSaveFileFailure

  ;
