import { TourState } from './tour.model';
import { TourActions, TourActionTypes } from './tour.actions';

export const initialState: TourState = {
  tours: [],
  loading: false,
  loaded: false,
  year: new Date().getFullYear()
};

export function tourReducer(
  state: TourState = initialState,
  action: TourActions
): TourState {
  switch (action.type) {
    case TourActionTypes.SET_YEAR: {
      return {
        ...state,
        year: action.payload
      };
    }
    case TourActionTypes.LOAD: {
      return {
        ...state,
        tours: [],
        loading: true
      };
    }
    case TourActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        tours: action.payload,
        loading: false,
        loaded: true
      };
    }
    case TourActionTypes.LOAD_FAILURE: {
      return {
        ...state,
        tours: [],
        loading: false,
        loaded: false
      };
    }
    case TourActionTypes.SAVE_SUCCESS: {
      return {
        ...state,
        tours: [
          ...state.tours.filter(r => ! action.payload.some(l => r.id === l.id)),
          ...action.payload
        ]
      };
    }
    default:
      return state;
  }
}
