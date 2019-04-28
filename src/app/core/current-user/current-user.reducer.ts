import { CurrentUserState } from './current-user.models';
import {
  CurrentUserActions,
  CurrentUserActionTypes
} from './current-user.actions';

const initialState: CurrentUserState = {
  user: undefined
};

export function currentUserReducer(
  state: CurrentUserState = initialState,
  action: CurrentUserActions
): CurrentUserState {
  switch (action.type) {
    case CurrentUserActionTypes.LOAD:
    case CurrentUserActionTypes.REGISTER:
      return {
        ...state,
        user: undefined
      };
    case CurrentUserActionTypes.REGISTER_SUCCESS:
    case CurrentUserActionTypes.LOAD_SUCCESS:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}
