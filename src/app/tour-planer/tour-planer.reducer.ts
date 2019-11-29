import { TourPlanerState } from './tour-planer.model';
import { TourPlanerActions, TourPlanerActionTypes } from './tour-planer.actions';

export const initialState: TourPlanerState = {
  loading: false,
  loaded: false,
  list: []
};

export function tourPlanerReducer(
  state: TourPlanerState = initialState,
  action: TourPlanerActions
): TourPlanerState {
  switch (action.type) {
    case TourPlanerActionTypes.LOAD: {
      return {
        ...state,
        loading: true,
        loaded: false,
        list: []
      };
    }
    case TourPlanerActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        list: action.payload
      };
    }
    case TourPlanerActionTypes.LOAD_FAILURE: {
      return {
        ...state,        
        loading: false,
        loaded: false,
        list: []
      };
    }
    case TourPlanerActionTypes.SAVE_SUCCESS: {
      return {
        ...state,
        list: [
          ...state.list.filter(
            r => r.id !== action.payload.id
          ),
          action.payload
        ]
      };
    }
    default:
      return state;
  }
}
