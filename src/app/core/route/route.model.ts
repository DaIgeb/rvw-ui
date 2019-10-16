import { AppState } from '@app/core';

export interface Route {
  id?: string;
  name: string;
  distance: number;
  elevation: number;
}

export interface RouteState {
  routes: Route[];
}

export interface State extends AppState {
  route: RouteState;
}
