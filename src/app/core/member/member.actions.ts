import { Action } from '@ngrx/store';
import { Member } from './member.model';

export enum MemberActionTypes {
  LOAD = '[Member] Load',
  LOAD_SUCCESS = '[Member] Load Success',
  LOAD_FAILURE = '[Member] Load Failure',
  SAVE = '[Member] Save',
  SAVE_SUCCESS = '[Member] Save Success',
  SAVE_FAILURE = '[Member] Save Failure',
}

export class ActionMemberLoad implements Action {
  readonly type = MemberActionTypes.LOAD;
}

export class ActionMemberLoadSuccess implements Action {
  readonly type = MemberActionTypes.LOAD_SUCCESS;

  constructor(public payload: Member[]) {}
}

export class ActionMemberLoadFailure implements Action {
  readonly type = MemberActionTypes.LOAD_FAILURE;

  constructor(public payload: any) {}
}

export class ActionMemberSave implements Action {
  readonly type = MemberActionTypes.SAVE;

  constructor(public payload: Member | Member[]) {}
}

export class ActionMemberSaveSuccess implements Action {
  readonly type = MemberActionTypes.SAVE_SUCCESS;

  constructor(public payload: Member[]) {}
}

export class ActionMemberSaveFailure implements Action {
  readonly type = MemberActionTypes.SAVE_FAILURE;

  constructor(public payload: any) {}
}

export type MemberActions =
  | ActionMemberLoad
  | ActionMemberLoadSuccess
  | ActionMemberLoadFailure
  | ActionMemberSave
  | ActionMemberSaveSuccess
  | ActionMemberSaveFailure
 ;
