export interface CurrentUserState {
  user?: User;
}

export interface User {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}
