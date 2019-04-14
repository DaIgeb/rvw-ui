import { ActionReducer } from '@ngrx/store';

import { AppActions, AppActionTypes } from '../app.actions';
import { LayoutState } from './layout.models';

const initialState: LayoutState = {
  showSideNav: true
};

export const layoutReducer: ActionReducer<LayoutState> = (
  state: LayoutState = initialState,
  action: AppActions
): LayoutState => {
  switch (action.type) {
    case AppActionTypes.ToggleSideNav:
      return {
        ...state,
        showSideNav: action.showSideNav
      };
    default:
      return state;
  }
};
