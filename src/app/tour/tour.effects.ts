import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as fromTour from './tour.actions';
import { TourService } from './tour.service';
import { of } from 'rxjs';
import { isArray } from 'util';
import { Location } from '@angular/common';

@Injectable()
export class TourEffects {
  constructor(
    private actions$: Actions,
    private tourService: TourService,
    private router: Router,
    private location: Location
  ) {}

  @Effect()
  load = this.actions$.pipe(
    ofType<fromTour.ActionTourLoad>(fromTour.TourActionTypes.LOAD),
    switchMap(a =>
      this.tourService.load().pipe(
        map(r => new fromTour.ActionTourLoadSuccess(r)),
        catchError(error => of(new fromTour.ActionTourLoadFailure(error)))
      )
    )
  );

  @Effect()
  save = this.actions$.pipe(
    ofType<fromTour.ActionTourSave>(fromTour.TourActionTypes.SAVE),
    switchMap(a =>
      this.tourService.save(a.payload).pipe(
        map(r => new fromTour.ActionTourSaveSuccess(isArray(r) ? r : [r])),
        catchError(error => of(new fromTour.ActionTourSaveFailure(error)))
      )
    )
  );

  @Effect({ dispatch: false })
  afterSave = this.actions$.pipe(
    ofType<fromTour.ActionTourSaveSuccess>(
      fromTour.TourActionTypes.SAVE_SUCCESS
    ),
    tap(a => this.location.back())
  );
}
