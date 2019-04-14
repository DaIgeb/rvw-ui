import { Action } from '@ngrx/store';

export enum AppActionTypes {
  ToggleSideNav = '[ToggleSideNav] ToggleSideNav'
}

export class ToggleSideNav implements Action {
  readonly type = AppActionTypes.ToggleSideNav;

  constructor(public showSideNav: boolean) {}
}

export type AppActions = ToggleSideNav;
