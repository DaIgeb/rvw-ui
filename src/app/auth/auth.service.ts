import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, bindNodeCallback, of } from 'rxjs';
import { WebAuth, Auth0DecodedHash, Auth0ParseHashError } from 'auth0-js';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0 = new WebAuth({
    clientID: environment.auth.CLIENT_ID,
    domain: environment.auth.CLIENT_DOMAIN,
    responseType: 'id_token token',
    redirectUri: environment.auth.REDIRECT,
    audience: environment.auth.AUDIENCE,
    scope: 'openid profile email'
  });

  private authFlag = 'isLoggedIn';
  // Create stream for token
  private token$ = new BehaviorSubject<string>(null);
  // Create stream for user profile data
  private userProfile$ = new BehaviorSubject<any>(null);
  // Authentication navigation
  onAuthSuccessUrl = '/';
  onAuthFailureUrl = '/';
  logoutUrl = environment.auth.LOGOUT_URL;
  // Create observable of Auth0 parseHash method to gather auth results
  parseHash$ = bindNodeCallback<Auth0DecodedHash | null>(
    this.auth0.parseHash.bind(this.auth0)
  );
  // Create observable of Auth0 checkSession method to
  // verify authorization server session and renew tokens
  checkSession$ = bindNodeCallback(this.auth0.checkSession.bind(this.auth0));

  constructor(private router: Router) {}

  login() {
    this.auth0.authorize();
  }

  getToken(): Observable<string> {
    return this.token$;
  }

  getUserProfile(): Observable<any> {
    return this.userProfile$;
  }

  handleLoginCallback() {
    if (window.location.hash && !this.authenticated) {
      this.parseHash$().subscribe(
        authResult => {
          this._setAuth(authResult);
          window.location.hash = '';
          this.router.navigate([this.onAuthSuccessUrl]);
        },
        err => this._handleError(err)
      );
    }
  }

  private _setAuth(authResult: Auth0DecodedHash) {
    // Observable of token
    this.token$.next(authResult.accessToken);
    // Emit value for user data subject
    this.userProfile$.next(authResult.idTokenPayload);
    // Set flag in local storage stating this app is logged in
    localStorage.setItem(this.authFlag, JSON.stringify(true));
  }

  get authenticated(): boolean {
    return JSON.parse(localStorage.getItem(this.authFlag));
  }

  renewAuth() {
    if (this.authenticated) {
      this.checkSession$({}).subscribe(
        authResult => this._setAuth(authResult as Auth0DecodedHash),
        err => {
          localStorage.removeItem(this.authFlag);
          this.router.navigate([this.onAuthFailureUrl]);
        }
      );
    }
  }

  logout() {
    // Set authentication status flag in local storage to false
    localStorage.setItem(this.authFlag, JSON.stringify(false));
    // This does a refresh and redirects back to homepage
    // Make sure you have the logout URL in your Auth0
    // Dashboard Application settings in Allowed Logout URLs
    this.auth0.logout({
      returnTo: this.logoutUrl,
      clientID: environment.auth.CLIENT_ID
    });
  }

  private _handleError(err) {
    if (err.error_description) {
      console.error(`Error: ${err.error_description}`);
    } else {
      console.error(`Error: ${JSON.stringify(err)}`);
    }
  }
}
