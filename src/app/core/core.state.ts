import {
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector
} from '@ngrx/store';
// import { routerReducer, RouterReducerState } from '@ngrx/router-store';
// import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '@env/environment';

import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { debug } from './meta-reducers/debug.reducer';
import { AuthState } from './auth/auth.models';
import { authReducer } from './auth/auth.reducer';
import { currentUserReducer } from './current-user/current-user.reducer';
import { CurrentUserState } from './current-user/current-user.models';
// import { RouterStateUrl } from './router/router.state';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  currentUser: currentUserReducer
  // router: routerReducer
};

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage
];
if (!environment.production) {
  // metaReducers.unshift(storeFreeze);
  if (!environment.test) {
    metaReducers.unshift(debug);
  }
}

export const selectAuthState = createFeatureSelector<AppState, AuthState>(
  'auth'
);

export const selectCurrentUserState = createFeatureSelector<AppState, CurrentUserState>(
  'currentUser'
);

export const selectRouterState = createFeatureSelector<
  AppState
//  RouterReducerState<RouterStateUrl>
>('router');

export interface AppState {
  auth: AuthState;
  currentUser: CurrentUserState;
//  router: RouterReducerState<RouterStateUrl>;
}
