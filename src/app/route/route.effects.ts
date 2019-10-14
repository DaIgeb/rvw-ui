import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, exhaustMap, map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as fromRoute from './route.actions';
import { RouteService } from './route.service';
import { of } from 'rxjs';
import { isArray } from 'util';

@Injectable()
export class RouteEffects {
  constructor(
    private actions$: Actions,
    private routeService: RouteService,
    private router: Router
  ) {}

  @Effect()
  load = this.actions$.pipe(
    ofType<fromRoute.ActionRouteLoad>(fromRoute.RouteActionTypes.LOAD),
    switchMap(a =>
      this.routeService.load().pipe(
        map(r => new fromRoute.ActionRouteLoadSuccess(r)),
        catchError(error => of(new fromRoute.ActionRouteLoadFailure(error)))
      )
    )
  );

  @Effect()
  save = this.actions$.pipe(
    ofType<fromRoute.ActionRouteSave>(fromRoute.RouteActionTypes.SAVE),
    switchMap(a =>
      this.routeService.save(a.payload).pipe(
        map(r => new fromRoute.ActionRouteSaveSuccess(isArray(r) ? r[0] : r)),
        catchError(error => of(new fromRoute.ActionRouteSaveFailure(error)))
      )
    )
  );

  @Effect()
  batchSave = this.actions$.pipe(
    ofType<fromRoute.ActionRouteBatchSave>(
      fromRoute.RouteActionTypes.BATCH_SAVE
    ),
    switchMap(a =>
      this.routeService.save(a.payload).pipe(
        map(
          r => new fromRoute.ActionRouteBatchSaveSuccess(isArray(r) ? r : [r])
        ),
        catchError(error =>
          of(new fromRoute.ActionRouteBatchSaveFailure(error))
        )
      )
    )
  );

  @Effect({ dispatch: false })
  afterSave = this.actions$.pipe(
    ofType<fromRoute.ActionRouteSaveSuccess>(
      fromRoute.RouteActionTypes.SAVE_SUCCESS
    ),
    tap(a => this.router.navigate(['./route']))
  );
}
