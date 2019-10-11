import { Action } from '@ngrx/store';
import { User } from './current-user.models';

export enum CurrentUserActionTypes {
  LOAD = '[Current User] Load',
  LOAD_SUCCESS = '[Current User] Load Success',
  LOAD_FAILURE = '[Current User] Load Failure',
  REGISTER = '[Current User] Register',
  REGISTER_SUCCESS = '[Current User] Register Success',
  REGISTER_FAILURE = '[Current User] Register Failure'
}

export class ActionCurrentUserLoad implements Action {
  readonly type = CurrentUserActionTypes.LOAD;

  constructor(public payload: string) {}
}

export class ActionCurrentUserLoadSuccess implements Action {
  readonly type = CurrentUserActionTypes.LOAD_SUCCESS;

  constructor(public payload: User) {}
}

export class ActionCurrentUserLoadFailure implements Action {
  readonly type = CurrentUserActionTypes.LOAD_FAILURE;
}

export class ActionCurrentUserRegister implements Action {
  readonly type = CurrentUserActionTypes.REGISTER;

  constructor(public payload: User) {}
}

export class ActionCurrentUserRegisterSuccess implements Action {
  readonly type = CurrentUserActionTypes.REGISTER_SUCCESS;

  constructor(public payload: User) {}
}


export class ActionCurrentUserRegisterFailure implements Action {
  readonly type = CurrentUserActionTypes.REGISTER_FAILURE;

  constructor(public payload: any) {}
}

export type CurrentUserActions =
  | ActionCurrentUserLoad
  | ActionCurrentUserLoadSuccess
  | ActionCurrentUserLoadFailure
  | ActionCurrentUserRegister
  | ActionCurrentUserRegisterSuccess
  | ActionCurrentUserRegisterFailure;
