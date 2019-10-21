import { TourState } from './tour.model';
import { TourActions, TourActionTypes } from './tour.actions';
import { Sort } from '@angular/material/sort';

export const initialState: TourState = {
  tours: [],
  loading: false,
  loaded: false,
  year: new Date().getFullYear(),
  list: {
    sort: [{ active: 'date', direction: 'desc' } as Sort]
  }
};

export function tourReducer(
  state: TourState = initialState,
  action: TourActions
): TourState {
  switch (action.type) {
    case TourActionTypes.SAVE_LIST_SORT: {
      const sort = action.payload;

      return {
        ...state,
        list: {
          ...state.list,
          sort: [sort, ...state.list.sort.filter(s => s.active !== sort.active)]
        }
      };
    }
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
          ...state.tours.filter(r => !action.payload.some(l => r.id === l.id)),
          ...action.payload
        ]
      };
    }
    default:
      return state;
  }
}
