import { AppState } from '@app/core';

export interface Route {
  name: string;
}

export interface RouteState {
  routes: Route[];
}

export interface State extends AppState {
  route: RouteState;
}
