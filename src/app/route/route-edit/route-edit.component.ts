import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectCurrentRouteDetailState } from '../../core/route/route.selectors';
import { AppState } from '@app/core';
import {
  ActivatedRoute
} from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { IDetail as Route, findTimeline } from 'rvw-model/lib/route';
import { ActionRouteSave, ActionRouteLoadDetail } from '@app/core/route/route.actions';
import * as moment from 'moment';

@Component({
  selector: 'rvw-route-edit',
  templateUrl: './route-edit.component.html',
  styleUrls: ['./route-edit.component.scss']
})
export class RouteEditComponent implements OnInit, OnDestroy {
  private currentRouteSubscription: Subscription;
  private route: Route;

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  type = new FormControl('', [Validators.required]);
  timelines = new FormArray([], [Validators.required, Validators.minLength(1)]);

  currentRouteFormGroup = new FormGroup({
    name: this.name,
    type: this.type,
    timelines: this.timelines
  });

  typeOptions = [
    { value: 'startRoute', label: 'Start-Route' },
    { value: 'route', label: 'Route' }
  ];
  id$: Observable<string>;

  constructor(
    private store: Store<AppState>,
    private routeSnapshot: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id$ = this.routeSnapshot.paramMap.pipe(map(r => r.get('id')));
    this.currentRouteSubscription = this.id$
      .pipe(
        switchMap(p =>
          this.store.pipe(select(selectCurrentRouteDetailState(p))
          )),
        tap(s => {
          if (!s.loading && !s.loaded) {
            this.store.dispatch(new ActionRouteLoadDetail(s.id))
          }
        }),
        map(s => s.item)
      )
      .subscribe(r => {
        this.route = r;
        this.reset();
      });
  }

  ngOnDestroy(): void {
    this.currentRouteSubscription.unsubscribe();
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

  reset() {
    this.timelines.clear();

    if (!this.route) {
      this.currentRouteFormGroup.patchValue({
        name: '',
        type: '',
        timelines: []
      });
    } else {
      (this.route.timelines || []).forEach(timeline => {
        this.timelines.push(new FormControl(timeline));
      });

      this.currentRouteFormGroup.patchValue({
        name: this.route.name,
        type: this.route.type,
        timelines: this.route.timelines || []
      });
      this.name.patchValue(this.route.name);
    }
  }

  save() {
    this.store.dispatch(
      new ActionRouteSave({
        id: this.route ? this.route.id : undefined,
        name: this.name.value,
        type: this.type.value,
        timelines: this.timelines.value.map(tl => ({
          ...(findTimeline(this.route, tl.from, tl.until)),
          ...tl,
          startRoute: tl.startRoute ? tl.startRoute.id : undefined,
          locations: (tl.locations || []).map(l => l.location.id),
          restaurants: (tl.restaurants || []).map(r => r.restaurant.id)
        }))
      })
    );
  }

  addTimeline() {
    const sorted = [...this.timelines.controls].sort((a, b) => -1 * moment(a.value.from).diff(moment(b.value.from)));
    const relevantControl = sorted[0];
    let nextFrom: string;

    if (!relevantControl) {
      nextFrom = moment('1970-01-01').format('YYYY-MM-DD');
    } else if (!relevantControl.value.until) {
      const until = moment(relevantControl.value.from).add(1, 'days').format('YYYY-MM-DD');
      nextFrom = moment(relevantControl.value.from).add(2, 'days').format('YYYY-MM-DD');
      relevantControl.patchValue({ until }, { emitEvent: false });
    } else {
      nextFrom = moment(relevantControl.value.until).add(1, 'days').format('YYYY-MM-DD')
    }

    this.timelines.push(new FormControl({
      from: nextFrom
    }));
  }

  getTimelineTitel(item: AbstractControl) {
    const from = item.value.from;
    const until = item.value.until || '-';

    if (from) {
      if (until) {
        return `${from} / ${until}`
      }

      return `${from} / -`;
    }

    return '';
  }
}
