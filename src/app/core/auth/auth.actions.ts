import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_COMPLETE = '[Login Page] Login Complete',
  LOGIN_SUCCESS = '[Auth API] Login Success',
  LOGIN_FAILURE = '[Auth API] Login Failure',
  LOGIN_CHECK = '[Auth] Check Login',
  LOGOUT = '[Auth] Logout',
  LOGOUT_CANCELLED = '[Auth] Logout Cancelled',
  LOGOUT_CONFIRMED = '[Auth] Logout Confirmed'
}

export class ActionAuthLogin implements Action {
  readonly type = AuthActionTypes.LOGIN;
}

export class ActionAuthLogout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class ActionAuthLoginComplete implements Action {
  readonly type = AuthActionTypes.LOGIN_COMPLETE;
}

export class ActionAuthLoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;

  constructor(public payload: { profile: any; redirectUrl?: string }) {}
}

export class ActionAuthLoginFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;

  constructor(public payload: any) {}
}

export class ActionAuthCheckLogin implements Action {
  readonly type = AuthActionTypes.LOGIN_CHECK;
}

export class ActionAuthLogoutConfirmed implements Action {
  readonly type = AuthActionTypes.LOGOUT_CONFIRMED;
}

export class ActionAuthLogoutCancelled implements Action {
  readonly type = AuthActionTypes.LOGOUT_CANCELLED;
}

export type AuthActions =
  | ActionAuthLogin
  | ActionAuthLoginComplete
  | ActionAuthLoginSuccess
  | ActionAuthLoginFailure
  | ActionAuthCheckLogin
  | ActionAuthLogout
  | ActionAuthLogoutCancelled
  | ActionAuthLogoutConfirmed;
