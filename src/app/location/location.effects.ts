import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, map, catchError, switchMap } from 'rxjs/operators';

import * as fromLocation from './location.actions';
import { LocationService } from './location.service';
import { of } from 'rxjs';
import { isArray } from 'util';
import { Location } from '@angular/common';

@Injectable()
export class LocationEffects {
  constructor(
    private actions$: Actions,
    private service: LocationService,
    private location: Location) { }

  @Effect()
  load = this.actions$.pipe(
    ofType<fromLocation.ActionLocationLoad>(fromLocation.LocationActionTypes.LOAD),
    switchMap(() =>
      this.service.load().pipe(
        map(r => new fromLocation.ActionLocationLoadSuccess(r)),
        catchError(error => of(new fromLocation.ActionLocationLoadFailure(error)))
      )
    )
  );

  @Effect()
  loadDetail = this.actions$.pipe(
    ofType<fromLocation.ActionLocationLoadDetail>(fromLocation.LocationActionTypes.LOAD_DETAIL),
    switchMap(a =>
      this.service.loadDetail(a.payload).pipe(
        map(r => new fromLocation.ActionLocationLoadDetailSuccess(r)),
        catchError(error => of(new fromLocation.ActionLocationLoadDetailFailure({ id: a.payload, err: error })))
      )
    )
  );

  @Effect()
  save = this.actions$.pipe(
    ofType<fromLocation.ActionLocationSave>(fromLocation.LocationActionTypes.SAVE),
    switchMap(a =>
      this.service.save(a.payload).pipe(
        map(r => new fromLocation.ActionLocationSaveSuccess(isArray(r) ? r : [r])),
        catchError(error => of(new fromLocation.ActionLocationSaveFailure(error)))
      )
    )
  );

  @Effect({ dispatch: false })
  afterSave = this.actions$.pipe(
    ofType<fromLocation.ActionLocationSaveSuccess>(
      fromLocation.LocationActionTypes.SAVE_SUCCESS
    ),
    tap(() => this.location.back())
  );
}
