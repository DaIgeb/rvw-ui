import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, map, catchError, switchMap } from 'rxjs/operators';

import * as fromLocation from './tour-planer.actions';
import { TourPlanerService } from './tour-planer.service';
import { of } from 'rxjs';
import { Location } from '@angular/common';

@Injectable()
export class TourPlanerEffects {
  constructor(
    private actions$: Actions,
    private service: TourPlanerService,
    private location: Location) { }

  @Effect()
  load = this.actions$.pipe(
    ofType<fromLocation.ActionTourPlanerLoad>(fromLocation.TourPlanerActionTypes.LOAD),
    switchMap(() =>
      this.service.load().pipe(
        map(r => new fromLocation.ActionTourPlanerLoadSuccess(r)),
        catchError(error => of(new fromLocation.ActionTourPlanerLoadFailure(error)))
      )
    )
  );

  @Effect()
  save = this.actions$.pipe(
    ofType<fromLocation.ActionTourPlanerSave>(fromLocation.TourPlanerActionTypes.SAVE),
    switchMap(a =>
      this.service.save(a.payload).pipe(
        map(r => new fromLocation.ActionTourPlanerSaveSuccess(r)),
        catchError(error => of(new fromLocation.ActionTourPlanerSaveFailure(error)))
      )
    )
  );

  @Effect({ dispatch: false })
  afterSave = this.actions$.pipe(
    ofType<fromLocation.ActionTourPlanerSaveSuccess>(
      fromLocation.TourPlanerActionTypes.SAVE_SUCCESS
    ),
    tap(() => this.location.back())
  );
}
