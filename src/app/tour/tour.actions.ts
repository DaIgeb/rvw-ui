import { Action } from '@ngrx/store';
import { Tour } from './tour.model';
import { Sort } from '@angular/material/sort';

export enum TourActionTypes {
  LOAD = '[Tour] Load',
  LOAD_SUCCESS = '[Tour] Load Success',
  LOAD_FAILURE = '[Tour] Load Failure',
  SAVE = '[Tour] Save',
  SAVE_SUCCESS = '[Tour] Save Success',
  SAVE_FAILURE = '[Tour] Save Failure',
  SET_YEAR = '[Tour] Set Year',
  SAVE_LIST_SORT = '[Tour] Save list sort'
}

export class ActionTourSaveListSort implements Action {
  readonly type = TourActionTypes.SAVE_LIST_SORT;

  constructor(public payload: Sort) {}
}

export class ActionTourSetYear implements Action {
  readonly type = TourActionTypes.SET_YEAR;

  constructor(public payload: number) {}
}

export class ActionTourLoad implements Action {
  readonly type = TourActionTypes.LOAD;
}

export class ActionTourLoadSuccess implements Action {
  readonly type = TourActionTypes.LOAD_SUCCESS;

  constructor(public payload: Tour[]) {}
}

export class ActionTourLoadFailure implements Action {
  readonly type = TourActionTypes.LOAD_FAILURE;

  constructor(public payload: any) {}
}

export class ActionTourSave implements Action {
  readonly type = TourActionTypes.SAVE;

  constructor(public payload: Tour | Tour[]) {}
}

export class ActionTourSaveSuccess implements Action {
  readonly type = TourActionTypes.SAVE_SUCCESS;

  constructor(public payload: Tour[]) {}
}

export class ActionTourSaveFailure implements Action {
  readonly type = TourActionTypes.SAVE_FAILURE;

  constructor(public payload: any) {}
}

export type TourActions =
  | ActionTourLoad
  | ActionTourLoadSuccess
  | ActionTourLoadFailure
  | ActionTourSave
  | ActionTourSaveSuccess
  | ActionTourSaveFailure
  | ActionTourSetYear
  | ActionTourSaveListSort;
