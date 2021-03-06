import { AuthState } from './auth.models';
import { AuthActions, AuthActionTypes } from './auth.actions';

const initialState: AuthState = {
  isAuthenticated: false,
  profile: undefined
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, profile: action.payload.profile };

    case AuthActionTypes.LOGOUT:
      return { ...state, isAuthenticated: false, profile: undefined };

    default:
      return state;
  }
}
