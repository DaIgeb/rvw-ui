import { AppState } from '@app/core';

export const NIGHT_MODE_THEME = 'BLACK-THEME';

export type Language = 'en' | 'sk' | 'de' | 'fr' | 'es' | 'pt-br' | 'he';

export interface NavigationState {
  showSideBar: boolean;
}

export interface State extends AppState {
  navigation: NavigationState;
}
