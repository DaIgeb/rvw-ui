import { createSelector } from '@ngrx/store';

import { selectCurrentUserState } from '../core.state';
import { CurrentUserState, User } from './current-user.models';

export const selectCurrentUser = createSelector(
  selectCurrentUserState,
  (state: CurrentUserState) => state.user
);

export const selectCurrentUserName = createSelector(
  selectCurrentUser,
  (state: User | undefined) =>
    state !== undefined ? `${state.firstName} ${state.lastName}` : undefined
);

export const selectCurrentUserIsAdmin = createSelector(
  selectCurrentUser,
  (state: User | undefined) =>
    state !== undefined && state.roles.indexOf('admin') !== -1
);
