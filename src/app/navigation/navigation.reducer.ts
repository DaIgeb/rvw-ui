import { NavigationState } from './navigation.model';
import { NavigationActions, NavigationActionTypes } from './navigation.actions';

export const initialState: NavigationState = {
  showSideBar: true
};

export function navigationReducer(
  state: NavigationState = initialState,
  action: NavigationActions
): NavigationState {
  switch (action.type) {
    case NavigationActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        showSideBar: !state.showSideBar
      };

    default:
      return state;
  }
}
