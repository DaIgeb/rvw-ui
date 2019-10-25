import {
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector
} from '@ngrx/store';

import { createMiddleware, createMetaReducer } from 'redux-beacon';
import GoogleAnalyticsGtag, { trackEvent, trackPageView } from '@redux-beacon/google-analytics-gtag';

import logger from '@redux-beacon/logger'; // optional

import { environment } from '@env/environment';

import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { debug } from './meta-reducers/debug.reducer';
import { AuthState } from './auth/auth.models';
import { authReducer } from './auth/auth.reducer';
import { currentUserReducer } from './current-user/current-user.reducer';
import { CurrentUserState } from './current-user/current-user.models';
import { memberReducer } from './member/member.reducer';
import { MemberState } from './member/member.model';
import { routeReducer } from '@app/core/route/route.reducer';
import { RouteState } from '@app/core/route/route.model';

import { ROUTER_NAVIGATION, routerReducer, RouterReducerState } from '@ngrx/router-store';

// Create or import an events map.
// See "getting started" pages for instructions.
const trackingId = 'UA-150593477-1';
const ga = GoogleAnalyticsGtag(trackingId);

const eventsMap = {
  [ROUTER_NAVIGATION]: trackPageView(action => ({
    path: action.payload.routerState.url,
  })),
  '*': trackEvent(action => ({
    category: 'redux',
    action: action.type,
  })),
};

const gaMetaReducer = createMetaReducer(eventsMap, ga);

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  currentUser: currentUserReducer,
  member: memberReducer,
  route: routeReducer,
  router: routerReducer
};

export function analyticsMetaReducer(reducer) {
  return gaMetaReducer(reducer);
}

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage,
  analyticsMetaReducer
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
  member: MemberState;
  route: RouteState;
  router: RouterReducerState<any>;
}
