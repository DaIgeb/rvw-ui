import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as fromMember from './member.actions';
import { MemberService } from './member.service';
import { of } from 'rxjs';
import { isArray } from 'util';

@Injectable()
export class MemberEffects {
  constructor(
    private actions$: Actions,
    private memberService: MemberService,
    private router: Router
  ) {}

  @Effect()
  load = this.actions$.pipe(
    ofType<fromMember.ActionMemberLoad>(fromMember.MemberActionTypes.LOAD),
    switchMap(a =>
      this.memberService.load().pipe(
        map(r => new fromMember.ActionMemberLoadSuccess(r)),
        catchError(error => of(new fromMember.ActionMemberLoadFailure(error)))
      )
    )
  );

  @Effect()
  save = this.actions$.pipe(
    ofType<fromMember.ActionMemberSave>(fromMember.MemberActionTypes.SAVE),
    switchMap(a =>
      this.memberService.save(a.payload).pipe(
        map(r => new fromMember.ActionMemberSaveSuccess(isArray(r) ? r : [r])),
        catchError(error => of(new fromMember.ActionMemberSaveFailure(error)))
      )
    )
  );

  @Effect({ dispatch: false })
  afterSave = this.actions$.pipe(
    ofType<fromMember.ActionMemberSaveSuccess>(
      fromMember.MemberActionTypes.SAVE_SUCCESS
    ),
    tap(a => this.router.navigate(['./member']))
  );
}
