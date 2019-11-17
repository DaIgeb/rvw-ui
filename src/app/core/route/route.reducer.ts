import { RouteState } from './route.model';
import { RouteActions, RouteActionTypes } from './route.actions';

export const initialState: RouteState = {
  loaded: false,
  loading: false,
  list: [],
  details: {}
};

export function routeReducer(
  state: RouteState = initialState,
  action: RouteActions
): RouteState {
  switch (action.type) {
    case RouteActionTypes.LOAD_DETAIL: {
      return {
        ...state,
        details: {
          ...state.details,
          [action.payload]: {
            id: action.payload,
            loaded: false,
            loading: true,
            item: undefined
          }
        }
      };
    }
    case RouteActionTypes.LOAD_DETAIL_SUCCESS: {
      return {
        ...state,
        details: {
          ...state.details,
          [action.payload.id]: {
            id: action.payload.id,
            loaded: true,
            loading: false,
            item: action.payload
          }
        }
      };
    }
    case RouteActionTypes.LOAD_DETAIL_FAILURE: {
      return {
        ...state,
        details: {
          ...state.details,
          [action.payload.id]: {
            id: action.payload.id,
            loaded: false,
            loading: false,
            item: undefined
          }
        }
      };
    }
    case RouteActionTypes.LOAD: {
      return {
        ...state,
        loaded: false,
        loading: true,
        list: []
      };
    }
    case RouteActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        loaded: true,
        loading: false,
        list: action.payload
      };
    }
    case RouteActionTypes.LOAD_FAILURE: {
      return {
        ...state,
        loaded: false,
        loading: false,
        list: []
      };
    }
    case RouteActionTypes.SAVE_SUCCESS: {
      return {
        ...state,
        list: [
          ...state.list.filter(r => !action.payload.some(l => r.id === l.id)),
          ...action.payload
        ]
      };
    }
    default:
      return state;
  }
}
