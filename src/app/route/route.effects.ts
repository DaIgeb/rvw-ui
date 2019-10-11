import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, exhaustMap, map, catchError, switchMap } from 'rxjs/operators';

import * as fromRoute from './route.actions';
import { RouteService } from './route.service';
import { of } from 'rxjs';

@Injectable()
export class RouteEffects {
  constructor(private actions$: Actions, private routeService: RouteService) {}

  @Effect()
  login = this.actions$.pipe(
    ofType<fromRoute.ActionRouteLoad>(fromRoute.RouteActionTypes.LOAD),
    exhaustMap(a =>
      this.routeService.load().pipe(
        map(r => new fromRoute.ActionRouteLoadSuccess(r)),
        catchError(error => of(new fromRoute.ActionRouteLoadFailure(error)))
      )
    )
  );
}
