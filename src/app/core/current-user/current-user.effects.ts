import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, exhaustMap, map, catchError, switchMap } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';

import { of, EMPTY } from 'rxjs';
import { CurrentUserService } from './current-user.service';
import * as fromAuth from '../auth/auth.actions';
import * as fromCurrentUser from './current-user.actions';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class CurrentUserEffects {
  constructor(
    private actions$: Actions<Action>,
    private currentUserService: CurrentUserService
  ) {}

  @Effect()
  afterLogin$ = this.actions$.pipe(
    ofType<fromAuth.ActionAuthLoginSuccess>(
      fromAuth.AuthActionTypes.LOGIN_SUCCESS
    ),
    map(() => new fromCurrentUser.ActionCurrentUserLoad())
  );

  @Effect()
  loadCurrentUser$ = this.actions$.pipe(
    ofType<fromCurrentUser.ActionCurrentUserLoad>(
      fromCurrentUser.CurrentUserActionTypes.LOAD
    ),
    switchMap(() =>
      this.currentUserService
        .getCurrentUser()
        .pipe(map((user) => new fromCurrentUser.ActionCurrentUserLoadSuccess(user)))
    )
  );
}
