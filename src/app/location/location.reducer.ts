import { LocationState } from './location.model';
import { LocationActions, LocationActionTypes } from './location.actions';

export const initialState: LocationState = {
  locations: []
};

export function locationReducer(
  state: LocationState = initialState,
  action: LocationActions
): LocationState {
  switch (action.type) {
    case LocationActionTypes.LOAD: {
      return {
        ...state,
        locations: []
      };
    }
    case LocationActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        locations: action.payload
      };
    }
    case LocationActionTypes.LOAD_FAILURE: {
      return {
        ...state,
        locations: []
      };
    }
    case LocationActionTypes.SAVE_SUCCESS: {
      return {
        ...state,
        locations: [
          ...state.locations.filter(
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
