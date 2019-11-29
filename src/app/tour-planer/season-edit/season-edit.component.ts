import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { selectTourPlanerState } from '../tour-planer.selectors';
import { ActionTourPlanerLoad, ActionTourPlanerSave } from '../tour-planer.actions';
import { IList, IEvent } from 'rvw-model/lib/season';
import * as moment from 'moment';

@Component({
  selector: 'rvw-season-edit',
  templateUrl: './season-edit.component.html',
  styleUrls: ['./season-edit.component.scss']
})
export class SeasonEditComponent implements OnInit {
  year = new FormControl('', [Validators.required]);
  seasonStart = new FormControl('', [Validators.required]);
  seasonEnd = new FormControl('', [Validators.required]);
  eveningStart = new FormControl('', [Validators.required]);
  eveningEnd = new FormControl('', [Validators.required]);
  events = new FormControl();
  formGroup = new FormGroup({
    year: this.year,
    seasonStart: this.seasonStart,
    seasonEnd: this.seasonEnd,
    eveningStart: this.eveningStart,
    eveningEnd: this.eveningEnd,
    events: this.events
  });
  id$: Observable<string>;
  currentRouteSubscription: Subscription;
  seasonItem: IList;

  constructor(
    private store: Store<AppState>,
    private routeSnapshot: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id$ = this.routeSnapshot.paramMap.pipe(map(r => r.get('id')));
    this.currentRouteSubscription = this.id$
      .pipe(
        switchMap(p =>
          this.store.select(selectTourPlanerState).pipe(
            tap(s => {
              if (!s.loading && !s.loaded) {
                this.store.dispatch(new ActionTourPlanerLoad())
              }
            }),
            map(s => s.list.find(i => i.id === p))
          )
        ))
      .subscribe(r => {
        this.seasonItem = r;
        this.reset();
      });

    this.year.valueChanges.subscribe(v => this.calculateDates(parseInt(v)));
  }

  calculateDates(year: number, ignoreDirty: boolean = false) {
    const seasonStart = moment().year(year).month('March').startOf('month').day('Saturday');
    const seasonEnd = moment().year(year).month('October').endOf('month').day('Friday');
    if (seasonEnd.month() !== 9) {
      seasonEnd.subtract('d', 7);
    }

    const eveningStart = moment([year, 3, 7]).day(2);
    const eveningEnd = moment([year, 8, 13]).day(4);

    this.formGroup.patchValue({
      seasonStart: this.seasonStart.dirty && !ignoreDirty ? this.seasonStart.value : seasonStart.format('YYYY-MM-DD'),
      seasonEnd: this.seasonEnd.dirty && !ignoreDirty ? this.seasonEnd.value : seasonEnd.format('YYYY-MM-DD'),
      eveningStart: this.eveningStart.dirty && !ignoreDirty ? this.eveningStart.value : eveningStart.format('YYYY-MM-DD'),
      eveningEnd: this.eveningEnd.dirty && !ignoreDirty ? this.eveningEnd.value : eveningEnd.format('YYYY-MM-DD')
    });
  }

  reset() {
    if (!this.seasonItem) {
      const year = this.year.value ? parseInt(this.year.value) : moment().add('year', 1).year();

      this.formGroup.patchValue({
        year,
        events: []
      });

      this.calculateDates(year);
    } else {
      this.formGroup.patchValue({
        year: this.seasonItem.year,
        seasonStart: this.seasonItem.seasonStart,
        seasonEnd: this.seasonItem.seasonEnd,
        eveningStart: this.seasonItem.eveningStart,
        eveningEnd: this.seasonItem.eveningEnd,
        events: this.seasonItem.events
      });
    }
  }

  save() {
    this.store.dispatch(new ActionTourPlanerSave({
      ...this.seasonItem,
      ...this.formGroup.value,
      seasonStart: moment(this.seasonStart.value).format('YYYY-MM-DD'),
      seasonEnd: moment(this.seasonEnd.value).format('YYYY-MM-DD'),
      eveningStart: moment(this.eveningStart.value).format('YYYY-MM-DD'),
      eveningEnd: moment(this.eveningEnd.value).format('YYYY-MM-DD'),
    }));
  }

  getErrorMessage(formControl: FormControl) {
    return formControl.hasError('required')
      ? 'You must enter a value'
      : formControl.hasError('email')
        ? 'Not a valid email'
        : formControl.hasError('minlength')
          ? 'Requires at least ' + formControl.errors.minlength.requiredLength
          : '';
  }
}
