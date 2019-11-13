import { LocationState } from './location.model';
import { LocationActions, LocationActionTypes } from './location.actions';

export const initialState: LocationState = {
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
        list: []
      };
    }
    case LocationActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
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
        list: []
      };
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
