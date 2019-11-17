import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl, FormArray, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators, Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { ITimeline as Timeline, IList } from 'rvw-model/lib/route';
import { LoggerService } from '@app/core/logger.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { selectRouteState } from '@app/core/route/route.selectors';
import { ActionRouteLoad } from '@app/core/route/route.actions';
import { tap, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'rvw-route-edit-timeline',
  templateUrl: './route-edit-timeline.component.html',
  styleUrls: ['./route-edit-timeline.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RouteEditTimelineComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: RouteEditTimelineComponent,
      multi: true
    },
  ]

})
export class RouteEditTimelineComponent implements OnInit, ControlValueAccessor, Validator {
  from = new FormControl('', [Validators.required]);
  until = new FormControl();
  distance = new FormControl();
  elevation = new FormControl();
  difficulty = new FormControl();
  startRoute = new FormControl();
  locations = new FormArray([]);
  restaurants = new FormArray([]);
  files = new FormArray([]);

  formGroup = new FormGroup({
    from: this.from,
    until: this.until,
    distance: this.distance,
    elevation: this.elevation,
    difficulty: this.difficulty,
    startRoute: this.startRoute,
    locations: this.locations,
    restaurants: this.restaurants,
    files: this.files,
  }, []);
  onTouched: any;

  difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'heavy', label: 'Heavy' }
  ];
  routes$: Observable<IList[]>;
  routes: IList[];
  filteredRoutes$: Observable<IList[]>;

  constructor(
    private store: Store<AppState>,
    private logger: LoggerService

  ) { }

  ngOnInit() {
    this.routes$ = this.store.select(selectRouteState).pipe(
      tap(s => {
        if (!s.loaded && !s.loading) {
          this.store.dispatch(new ActionRouteLoad());
        }
      }),
      map(s => s.list.filter(s => s.type === 'startroute'))
    );
    this.routes$.subscribe(l => this.routes = l);

    this.filteredRoutes$ = this.startRoute.valueChanges.pipe(
      startWith({}),
      map(filterValue => this.filterRoutes(filterValue))
    );
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

  writeValue(obj: Timeline): void {
    this.formGroup.patchValue({
      ...obj,
      from: obj.from || this.formGroup.value.from || moment().format('YYYY-MM-DD')
    }, { emitEvent: true });
  }

  registerOnChange(fn) {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.formGroup.valid ? null : {
      form: {
        valid: false,
        message: 'Invalid'
      }
    };
  }

  displayRoute(args: IList) {
    return args.name;
  }

  private filterRoutes(value: string): IList[] {
    if (value.toLocaleLowerCase) {
      const filterValue = value.toLocaleLowerCase();

      return this.routes.filter(
        option =>
          this.displayRoute(option)
            .toLocaleLowerCase()
            .indexOf(filterValue) > -1
      );
    }

    return this.routes;
  }
}
