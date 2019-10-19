import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, bindNodeCallback, of, ReplaySubject } from 'rxjs';
import { WebAuth, Auth0DecodedHash, Auth0ParseHashError } from 'auth0-js';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage/local-storage.service';

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
  private token$ = new ReplaySubject<string>(1);
  private userProfile$ = new ReplaySubject<any>(1);

  // Authentication navigation
  onAuthSuccessUrl = '/';
  onAuthFailureUrl = '/';
  logoutUrl = environment.auth.LOGOUT_URL;

  parseHash$ = bindNodeCallback<Auth0DecodedHash | null>(
    this.auth0.parseHash.bind(this.auth0)
  );
  checkSession$ = bindNodeCallback(this.auth0.checkSession.bind(this.auth0));

  constructor(private router: Router, private localStorage: LocalStorageService) {}

  login() {
    this.auth0.authorize({
      state: this.router.routerState.snapshot.url
    });
  }

  getToken(): Observable<string> {
    return this.token$;
  }

  getUserProfile(): Observable<any> {
    return this.userProfile$;
  }

  setAuth(authResult: Auth0DecodedHash) {
    this.token$.next(authResult.accessToken);
    this.userProfile$.next(authResult.idTokenPayload);
    this.localStorage.setItem(this.authFlag, JSON.stringify(true));
  }

  get authenticated(): boolean {
    return JSON.parse(this.localStorage.getItem(this.authFlag));
  }

  renewAuth() {
    if (this.authenticated) {
      this.checkSession$({}).subscribe(
        authResult => this.setAuth(authResult as Auth0DecodedHash),
        err => {
          this.localStorage.removeItem(this.authFlag);
          this.router.navigate([this.onAuthFailureUrl]);
        }
      );
    }
  }

  logout() {
    this.localStorage.setItem(this.authFlag, JSON.stringify(false));

    this.auth0.logout({
      returnTo: this.logoutUrl,
      clientID: environment.auth.CLIENT_ID
    });
  }

  resetAuthFlag() {
    this.localStorage.removeItem(this.authFlag);
  }
}
