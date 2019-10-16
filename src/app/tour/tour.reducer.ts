import { TourState } from './tour.model';
import { TourActions, TourActionTypes } from './tour.actions';

export const initialState: TourState = {
  tours: []
};

export function tourReducer(
  state: TourState = initialState,
  action: TourActions
): TourState {
  switch (action.type) {
    case TourActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        tours: action.payload
      };
    }
    case TourActionTypes.LOAD_FAILURE: {
      return {
        ...state,
        tours: []
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
