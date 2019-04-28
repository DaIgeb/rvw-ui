import { createSelector } from '@ngrx/store';

import { selectAuthState } from '../core.state';
import { AuthState } from './auth.models';

export const selectAuth = createSelector(
  selectAuthState,
  (state: AuthState) => state
);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (state: AuthState) => state.isAuthenticated
);

export const selectProfile = createSelector(
  selectAuth,
  (state: AuthState) => state.profile
);

export const selectProfileSubject = createSelector(
  selectProfile,
  (state: any) => (state ? state.sub : undefined)
);
