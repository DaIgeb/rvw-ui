import { RouteState } from './route.model';
import { RouteActions, RouteActionTypes } from './route.actions';

export const initialState: RouteState = {
  routes: []
};

export function routeReducer(
  state: RouteState = initialState,
  action: RouteActions
): RouteState {
  switch (action.type) {
    case RouteActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        routes: action.payload
      };
    }
    case RouteActionTypes.LOAD_FAILURE: {
      return {
        ...state,
        routes: []
      };
    }
    case RouteActionTypes.SAVE_SUCCESS: {
      return {
        ...state,
        routes: [
          ...state.routes.filter(r => ! action.payload.some(l => r.id === l.id)),
          ...action.payload
        ]
      };
    }
    default:
      return state;
  }
}