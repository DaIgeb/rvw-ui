import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectCurrentRouteRoutes, selectCurrentRouteDetailState } from '../../core/route/route.selectors';
import { AppState } from '@app/core';
import {
  ActivatedRoute
} from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { IDetail as Route } from 'rvw-model/lib/route';
import { ActionRouteSave, ActionRouteLoadDetail } from '@app/core/route/route.actions';

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

  constructor(
    private store: Store<AppState>,
    private routeSnapshot: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentRouteSubscription = this.routeSnapshot.paramMap
      .pipe(
        switchMap(p =>
          this.store.pipe(select(selectCurrentRouteDetailState(p.get('id'))))
        ),
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
      this.route.timelines.forEach(timeline => {
        this.timelines.push(new FormControl(timeline));
      });

      this.currentRouteFormGroup.patchValue({
        name: this.route.name,
        type: this.route.type,
        timelines: this.route.timelines
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
        timelines: this.timelines.value
      })
    );
  }

  addTimeline() {
    this.timelines.push(new FormControl());
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
