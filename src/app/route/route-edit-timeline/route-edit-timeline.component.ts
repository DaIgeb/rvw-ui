/// <reference types="@types/googlemaps" />

import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl, FormArray, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators, Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { ITimeline as Timeline, IList } from 'rvw-model/lib/route';
import { IList as ILocationList } from 'rvw-model/lib/location';
import { LoggerService } from '@app/core/logger.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { selectRouteState } from '@app/core/route/route.selectors';
import { ActionRouteLoad, ActionRouteSaveFile } from '@app/core/route/route.actions';
import { tap, map, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { selectLocationState } from '@app/location/location.selectors';
import { ActionLocationLoad } from '@app/location/location.actions';
import { filter } from 'minimatch';

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
  @Input()
  id: string;

  @Input()
  type: string;

  from = new FormControl('', [Validators.required]);
  until = new FormControl();
  distance = new FormControl();
  elevation = new FormControl();
  difficulty = new FormControl('', []);
  startRoute = new FormControl();
  locations = new FormArray([]);
  restaurants = new FormArray([]);
  files = [];

  formGroup = new FormGroup({
    from: this.from,
    until: this.until,
    distance: this.distance,
    elevation: this.elevation,
    difficulty: this.difficulty,
    startRoute: this.startRoute,
    locations: this.locations,
    restaurants: this.restaurants
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
  locations$: Observable<ILocationList[]>;
  locationsData: ILocationList[];
  filteredLocations: Observable<ILocationList[]>[] = [];
  filteredRestaurants: Observable<ILocationList[]>[] = [];
  locationsLoaded: boolean;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.locations$ = this.store.select(selectLocationState).pipe(
      tap(s => {
        if (!s.loaded && !s.loading) {
          this.locationsLoaded = false;
          this.store.dispatch(new ActionLocationLoad());
        }

        if (s.loaded) {
          this.locationsLoaded = true;
        }
      }),
      map(s => s.list)
    );

    this.locations$.subscribe(l => this.locationsData = l);

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
    this.files = obj.files || [];
    
    this.locations$.subscribe(locs => {
      this.locations.clear();
      if (obj.locations) {
        obj.locations.forEach(() => this.locations.push(this.createLocation()));
      }

      this.restaurants.clear();
      if (obj.restaurants) {
        obj.restaurants.forEach(() => this.restaurants.push(this.createRestaurant()));
      }

      this.formGroup.patchValue({
        ...obj,
        from: obj.from || this.formGroup.value.from || moment().format('YYYY-MM-DD'),
        startRoute: this.routes.find(r => r.id === obj.startRoute),
        locations: obj.locations.map(l => ({ location: locs.find(ld => ld.id === l) })),
        restaurants: obj.restaurants.map(l => ({ restaurant: locs.find(ld => ld.id === l) }))
      }, { emitEvent: true });
    });
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

  onUploadFile(file: File) {
    this.store.dispatch(new ActionRouteSaveFile({ file, id: this.id, timeline: this.formGroup.value }))
  }

  displayLocation(loc: ILocationList) {
    if (loc) {
      if (loc.identifier) {
        return `${loc.name}/${loc.identifier}`;
      }

      return `${loc.name}`;
    }

    return '';
  }

  displayRoute(args: IList) {
    if (args) {
      return args.name;
    }

    return '';
  }

  addLocation() {
    this.locations.push(this.createLocation());
  }

  addRestaurant() {
    this.restaurants.push(this.createRestaurant());
  }

  removeLocation(i: number) {
    this.locations.removeAt(i);
    this.filteredLocations.splice(i, 1);
  }

  removeRestaurant(i: number) {
    this.restaurants.removeAt(i);
    this.filteredRestaurants.splice(i, 1);
  }

  private createLocation() {
    const formControl = new FormControl();

    this.filteredLocations.push(
      formControl.valueChanges
        .pipe(
          startWith(location),
          switchMap(value => this.filterLocations(value))
        )
        .pipe(
          tap(arr =>
            arr.sort((a, b) =>
              this.displayLocation(a).localeCompare(this.displayLocation(b))
            )
          )
        )
    );

    return new FormGroup({ location: formControl });
  }

  private createRestaurant() {
    const formControl = new FormControl(undefined);

    this.filteredRestaurants.push(
      formControl.valueChanges
        .pipe(
          startWith({}),
          switchMap(value => this.filterRestaurants(value))
        )
        .pipe(
          tap(arr =>
            arr.sort((a, b) =>
              this.displayLocation(a).localeCompare(this.displayLocation(b))
            )
          )
        )
    );

    return new FormGroup({ restaurant: formControl });
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

  private isLocation(value: any): value is ILocationList {
    return value && (value as ILocationList).name !== undefined;
  }

  private filterLocations(value: string): Observable<ILocationList[]> {
    let filterValue: string;
    if (!value) {
      filterValue = '';
    } else if (this.isLocation(value)) {
      filterValue = this.displayLocation(value).toLocaleLowerCase();
    } else if (value.toLocaleLowerCase) {
      filterValue = value.toLocaleLowerCase();
    }

    const alreadySelectedMembers = this.locations.value.map(p =>
      p.location ? p.location.id : undefined
    );

    return this.locations$.pipe(
      map(
        option =>
          option.filter(l =>
            alreadySelectedMembers.indexOf(l.id) === -1 &&
            this.displayLocation(l)
              .toLocaleLowerCase()
              .indexOf(filterValue) > -1
          )
      ));
  }

  private filterRestaurants(value: string): Observable<ILocationList[]> {
    let filterValue: string;
    if (!value) {
      filterValue = '';
    } else if (this.isLocation(value)) {
      filterValue = this.displayLocation(value).toLocaleLowerCase();
    } else if (value.toLocaleLowerCase) {
      filterValue = value.toLocaleLowerCase();
    }

    const alreadySelectedMembers = this.restaurants.value.map(p =>
      p.location ? p.location.id : undefined
    );

    const selectedLocations = this.locations.value.map(v => this.isLocation(v.location) ? v.location.id : v.location);

    return this.locations$.pipe(
      map(
        option =>
          option.filter(l =>
            l.type === 'restaurant' &&
            selectedLocations.indexOf(l.id) !== -1 &&
            alreadySelectedMembers.indexOf(l.id) === -1 &&
            this.displayLocation(l)
              .toLocaleLowerCase()
              .indexOf(filterValue) > -1
          )
      ));
  }
}
