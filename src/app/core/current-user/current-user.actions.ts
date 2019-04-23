import { Action } from '@ngrx/store';
import { User } from './current-user.models';

export enum CurrentUserActionTypes {
  LOAD = '[Current User] Load',
  LOAD_SUCCESS = '[Current User] Load Success',
  LOAD_FAILURE = '[Current User] Load Failure'
}

export class ActionCurrentUserLoad implements Action {
  readonly type = CurrentUserActionTypes.LOAD;
}

export class ActionCurrentUserLoadSuccess implements Action {
  readonly type = CurrentUserActionTypes.LOAD_SUCCESS;

  constructor(public payload: User) {}
}

export type CurrentUserActions =
  | ActionCurrentUserLoad
  | ActionCurrentUserLoadSuccess;
