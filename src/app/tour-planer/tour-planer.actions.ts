import { Action } from '@ngrx/store';

import { IList } from 'rvw-model/lib/season';

export enum TourPlanerActionTypes {
  LOAD = '[Tour-Planer] Load',
  LOAD_SUCCESS = '[Tour-Planer] Load Success',
  LOAD_FAILURE = '[Tour-Planer] Load Failure',
  SAVE = '[Tour-Planer] Save',
  SAVE_SUCCESS = '[Tour-Planer] Save Success',
  SAVE_FAILURE = '[Tour-Planer] Save Failure'
}

export class ActionTourPlanerLoad implements Action {
  readonly type = TourPlanerActionTypes.LOAD;
}

export class ActionTourPlanerLoadSuccess implements Action {
  readonly type = TourPlanerActionTypes.LOAD_SUCCESS;

  constructor(public payload: IList[]) { }
}

export class ActionTourPlanerLoadFailure implements Action {
  readonly type = TourPlanerActionTypes.LOAD_FAILURE;

  constructor(public payload: any) { }
}

export class ActionTourPlanerSave implements Action {
  readonly type = TourPlanerActionTypes.SAVE;

  constructor(public payload: IList) { }
}

export class ActionTourPlanerSaveSuccess implements Action {
  readonly type = TourPlanerActionTypes.SAVE_SUCCESS;

  constructor(public payload: IList) { }
}

export class ActionTourPlanerSaveFailure implements Action {
  readonly type = TourPlanerActionTypes.SAVE_FAILURE;

  constructor(public payload: any) { }
}

export type TourPlanerActions =
  | ActionTourPlanerLoad
  | ActionTourPlanerLoadSuccess
  | ActionTourPlanerLoadFailure
  | ActionTourPlanerSave
  | ActionTourPlanerSaveSuccess
  | ActionTourPlanerSaveFailure
  ;
