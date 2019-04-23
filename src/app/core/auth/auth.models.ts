export interface AuthState {
  isAuthenticated: boolean;
  profile: {
    sub: string;
    [index: string]: any;
  };
}
