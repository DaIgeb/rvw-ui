import { Action } from '@ngrx/store';
import { Detail as Location } from 'rvw-model/lib/location';

export enum LocationActionTypes {
  LOAD = '[Location] Load',
  LOAD_SUCCESS = '[Location] Load Success',
  LOAD_FAILURE = '[Location] Load Failure',
  SAVE = '[Location] Save',
  SAVE_SUCCESS = '[Location] Save Success',
  SAVE_FAILURE = '[Location] Save Failure'
}

export class ActionLocationLoad implements Action {
  readonly type = LocationActionTypes.LOAD;
}

export class ActionLocationLoadSuccess implements Action {
  readonly type = LocationActionTypes.LOAD_SUCCESS;

  constructor(public payload: Location[]) {}
}

export class ActionLocationLoadFailure implements Action {
  readonly type = LocationActionTypes.LOAD_FAILURE;

  constructor(public payload: any) {}
}

export class ActionLocationSave implements Action {
  readonly type = LocationActionTypes.SAVE;

  constructor(public payload: Location | Location[]) {}
}

export class ActionLocationSaveSuccess implements Action {
  readonly type = LocationActionTypes.SAVE_SUCCESS;

  constructor(public payload: Location[]) {}
}

export class ActionLocationSaveFailure implements Action {
  readonly type = LocationActionTypes.SAVE_FAILURE;

  constructor(public payload: any) {}
}

export type LocationActions =
  | ActionLocationLoad
  | ActionLocationLoadSuccess
  | ActionLocationLoadFailure
  | ActionLocationSave
  | ActionLocationSaveSuccess
  | ActionLocationSaveFailure;
