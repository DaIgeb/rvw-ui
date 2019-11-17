import { Action } from '@ngrx/store';
import { Detail, IList } from 'rvw-model/lib/location';

export enum LocationActionTypes {
  LOAD = '[Location] Load',
  LOAD_SUCCESS = '[Location] Load Success',
  LOAD_FAILURE = '[Location] Load Failure',
  LOAD_DETAIL = '[Location] Load detail',
  LOAD_DETAIL_SUCCESS = '[Location] Load detail Success',
  LOAD_DETAIL_FAILURE = '[Location] Load detail Failure',
  SAVE = '[Location] Save',
  SAVE_SUCCESS = '[Location] Save Success',
  SAVE_FAILURE = '[Location] Save Failure'
}

export class ActionLocationLoad implements Action {
  readonly type = LocationActionTypes.LOAD;
}

export class ActionLocationLoadSuccess implements Action {
  readonly type = LocationActionTypes.LOAD_SUCCESS;

  constructor(public payload: IList[]) { }
}

export class ActionLocationLoadFailure implements Action {
  readonly type = LocationActionTypes.LOAD_FAILURE;

  constructor(public payload: any) { }
}

export class ActionLocationLoadDetail implements Action {
  readonly type = LocationActionTypes.LOAD_DETAIL;

  constructor(public payload: string) { }
}

export class ActionLocationLoadDetailSuccess implements Action {
  readonly type = LocationActionTypes.LOAD_DETAIL_SUCCESS;

  constructor(public payload: Detail) { }
}

export class ActionLocationLoadDetailFailure implements Action {
  readonly type = LocationActionTypes.LOAD_DETAIL_FAILURE;

  constructor(public payload: { id: string; err: any }) { }
}

export class ActionLocationSave implements Action {
  readonly type = LocationActionTypes.SAVE;

  constructor(public payload: Detail | Detail[]) { }
}

export class ActionLocationSaveSuccess implements Action {
  readonly type = LocationActionTypes.SAVE_SUCCESS;

  constructor(public payload: Detail[]) { }
}

export class ActionLocationSaveFailure implements Action {
  readonly type = LocationActionTypes.SAVE_FAILURE;

  constructor(public payload: any) { }
}

export type LocationActions =
  | ActionLocationLoad
  | ActionLocationLoadSuccess
  | ActionLocationLoadFailure
  | ActionLocationLoadDetail
  | ActionLocationLoadDetailSuccess
  | ActionLocationLoadDetailFailure
  | ActionLocationSave
  | ActionLocationSaveSuccess
  | ActionLocationSaveFailure;
