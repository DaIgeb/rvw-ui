import { Action } from '@ngrx/store';

export enum NavigationActionTypes {
  TOGGLE_SIDEBAR = '[Navigation] Toggle Sidebar'
}

export class ActionNavigationToggleSidebar implements Action {
  readonly type = NavigationActionTypes.TOGGLE_SIDEBAR;
}

export type NavigationActions =
  | ActionNavigationToggleSidebar
 ;
