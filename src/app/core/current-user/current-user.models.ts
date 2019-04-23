export interface CurrentUserState {
  user?: User;
}

export interface User {
  roles: string[];
}
