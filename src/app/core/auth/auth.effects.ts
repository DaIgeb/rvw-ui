import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, exhaustMap, map, catchError } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';

import * as fromAuth from './auth.actions';
import { AuthService } from './auth.service';
import { of, EMPTY } from 'rxjs';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService
  ) {}

  @Effect({ dispatch: false })
  login = this.actions$.pipe(
    ofType<fromAuth.ActionAuthLogin>(fromAuth.AuthActionTypes.LOGIN),
    tap(() => this.authService.login())
  );

  @Effect({ dispatch: false })
  logout = this.actions$.pipe(
    ofType<fromAuth.ActionAuthLogout>(fromAuth.AuthActionTypes.LOGOUT),
    tap(() => {
      this.router.navigate(['']);
      this.authService.logout();
    })
  );

  @Effect()
  loginComplete$ = this.actions$.pipe(
    ofType<fromAuth.ActionAuthLoginComplete>(
      fromAuth.AuthActionTypes.LOGIN_COMPLETE
    ),
    exhaustMap(() => {
      return this.authService.parseHash$().pipe(
        map(authResult => {
          console.log(authResult);
          if (authResult && authResult.accessToken) {
            this.authService.setAuth(authResult);
            return new fromAuth.ActionAuthLoginSuccess({
              profile: authResult.idTokenPayload,
              redirectUrl: authResult.state
            });
          }
        }),
        catchError(error => of(new fromAuth.ActionAuthLoginFailure(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType<fromAuth.ActionAuthLoginSuccess>(
      fromAuth.AuthActionTypes.LOGIN_SUCCESS
    ),
    tap(action => {
      this.router.navigate([
        action.payload.redirectUrl || this.authService.onAuthSuccessUrl
      ]);
    })
  );

  @Effect({ dispatch: false })
  loginErrorRedirect$ = this.actions$.pipe(
    ofType<fromAuth.ActionAuthLoginFailure>(
      fromAuth.AuthActionTypes.LOGIN_FAILURE
    ),
    map(action => action.payload),
    tap((err: any) => {
      if (err.error_description) {
        console.error(`Error: ${err.error_description}`);
      } else {
        console.error(`Error: ${JSON.stringify(err)}`);
      }
      this.router.navigate([this.authService.onAuthFailureUrl]);
    })
  );

  @Effect()
  checkLogin$ = this.actions$.pipe(
    ofType<fromAuth.ActionAuthCheckLogin>(fromAuth.AuthActionTypes.LOGIN_CHECK),
    exhaustMap(() => {
      if (this.authService.authenticated) {
        return this.authService.checkSession$({}).pipe(
          map((authResult: any) => {
            if (authResult && authResult.accessToken) {
              this.authService.setAuth(authResult);
              return new fromAuth.ActionAuthLoginSuccess({
                profile: authResult.idTokenPayload
              });
            }
          }),
          catchError(error => {
            this.authService.resetAuthFlag();
            return of(new fromAuth.ActionAuthLoginFailure({ error }));
          })
        );
      } else {
        return EMPTY;
      }
    })
  );

  @Effect()
  logoutConfirmation$ = this.actions$.pipe(
    ofType<fromAuth.ActionAuthLogout>(fromAuth.AuthActionTypes.LOGOUT),
    exhaustMap(
      () => of(new fromAuth.ActionAuthLogoutConfirmed())
      /* this.dialogService
        .open(LogoutPromptComponent)
        .afterClosed()
        .pipe(
          map(confirmed => {
            if (confirmed) {
              return new fromAuth.LogoutConfirmed();
            } else {
              return new fromAuth.LogoutCancelled();
            }
          })*/
    )
  );
}
