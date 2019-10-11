export interface CurrentUserState {
  user?: User;
}

export interface User {
  subject: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}
