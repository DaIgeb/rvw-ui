import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, exhaustMap, map, catchError, switchMap } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';

import { of, EMPTY, scheduled } from 'rxjs';
import { CurrentUserService } from './current-user.service';
import * as fromAuth from '../auth/auth.actions';
import * as fromCurrentUser from './current-user.actions';
import { Router } from '@angular/router';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class CurrentUserEffects {
  constructor(
    private actions$: Actions<Action>,
    private router: Router,
    private currentUserService: CurrentUserService
  ) { }

  @Effect()
  afterLogin$ = this.actions$.pipe(
    ofType<fromAuth.ActionAuthLoginSuccess>(
      fromAuth.AuthActionTypes.LOGIN_SUCCESS
    ),
    map(a => new fromCurrentUser.ActionCurrentUserLoad(a.payload.profile.sub))
  );

  @Effect()
  loadCurrentUser$ = this.actions$.pipe(
    ofType<fromCurrentUser.ActionCurrentUserLoad>(
      fromCurrentUser.CurrentUserActionTypes.LOAD
    ),
    exhaustMap(a =>
      this.currentUserService.getCurrentUser(a.payload).pipe(
        map(user => {
          if (!user) {
            this.router.navigate(['/current-user/profile']);
            return new fromCurrentUser.ActionCurrentUserLoadFailure();
          }

          return new fromCurrentUser.ActionCurrentUserLoadSuccess(user);
        })
      )
    )
  );

  @Effect()
  registerSuccess$ = this.actions$.pipe(
    ofType<fromCurrentUser.ActionCurrentUserRegisterSuccess>(
      fromCurrentUser.CurrentUserActionTypes.REGISTER_SUCCESS
    ),
    exhaustMap(a => this.router.navigate(['/']))
  );

  @Effect()
  register$ = this.actions$.pipe(
    ofType<fromCurrentUser.ActionCurrentUserRegister>(
      fromCurrentUser.CurrentUserActionTypes.REGISTER
    ),
    exhaustMap(a =>
      this.currentUserService
        .registerCurrentUser(a.payload)
        .pipe(
          map(
            user => new fromCurrentUser.ActionCurrentUserRegisterSuccess(user)
          ),
          catchError(error => of(new fromCurrentUser.ActionCurrentUserRegisterFailure(error)))
        )
    )
  );
}
