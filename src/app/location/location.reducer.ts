import { LocationState } from './location.model';
import { LocationActions, LocationActionTypes } from './location.actions';

export const initialState: LocationState = {
  loading: false,
  loaded: false,
  list: [],
  details: {}
};

export function locationReducer(
  state: LocationState = initialState,
  action: LocationActions
): LocationState {
  switch (action.type) {
    case LocationActionTypes.LOAD: {
      return {
        ...state,
        loading: true,
        loaded: false,
        list: []
      };
    }
    case LocationActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        list: action.payload,
        details: action.payload.reduce((prev, cur) => {
          prev[cur.id] = cur;
          return prev;
        }, {})
      };
    }
    case LocationActionTypes.LOAD_FAILURE: {
      return {
        ...state,        
        loading: false,
        loaded: false,
        list: []
      };
    }
    case LocationActionTypes.LOAD_DETAIL: {
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
      }

    }
    case LocationActionTypes.LOAD_DETAIL_SUCCESS: {
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
      }

    }
    case LocationActionTypes.LOAD_DETAIL_FAILURE: {
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
      }

    }
    case LocationActionTypes.SAVE_SUCCESS: {
      return {
        ...state,
        list: [
          ...state.list.filter(
            r => !action.payload.some(l => r.id === l.id)
          ),
          ...action.payload
        ]
      };
    }
    default:
      return state;
  }
}
