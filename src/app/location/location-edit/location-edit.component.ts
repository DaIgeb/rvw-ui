import { MapOptions } from 'googlemaps';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { Location } from '../location.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core';
import { ActivatedRoute } from '@angular/router';
import { ActionLocationSave, ActionLocationLoad } from '../location.actions';
import { switchMap, startWith } from 'rxjs/operators';
import { selectLocationById } from '../location.selectors';

@Component({
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss']
})
export class LocationEditComponent implements OnInit, AfterViewInit {
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  type = new FormControl('', [Validators.required]);
  street = new FormControl('', []);
  zipCode = new FormControl('', []);
  city = new FormControl('', []);
  longitude = new FormControl('', []);
  latitude = new FormControl('', []);
  timelines = new FormArray([]);

  formGroup = new FormGroup({
    name: this.name,
    type: this.type,
    street: this.street,
    zipCode: this.zipCode,
    city: this.city,
    longitude: this.longitude,
    latitude: this.latitude,
    timelines: this.timelines
  });

  currentLocation$: Observable<Location>;
  location: Location;

  typeOptions = [
    { value: 'position', label: 'Position' },
    { value: 'restaurant', label: 'Restaurant' }
  ];

  @ViewChild('gmap', { static: true }) mapElement: ElementRef;
  map: google.maps.Map;

  constructor(
    private store: Store<AppState>,
    private snapshot: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new ActionLocationLoad());

    this.currentLocation$ = this.snapshot.paramMap.pipe(
      switchMap(p => this.store.pipe(select(selectLocationById(p.get('id')))))
    );
    this.currentLocation$.subscribe(r => {
      this.location = r;
      this.reset();
    });
  }

  ngAfterViewInit(): void {
    const mapProperties: MapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );

    const marker = new google.maps.Marker({
      draggable: true,
      map: this.map,
      title: this.location ? this.location.name : 'test'
    });

    marker.addListener('dragend', () => {
      const pos = marker.getPosition();

      this.formGroup.patchValue(
        {
          longitude: pos.lng(),
          latitude: pos.lat()
        },
        { emitEvent: true }
      );
      console.log(pos);
    });

    combineLatest([
      this.latitude.valueChanges,
      this.longitude.valueChanges
    ]).subscribe(changed => {
      const position = new google.maps.LatLng(changed[0], changed[1]);
      this.map.setCenter(position);
      marker.setPosition(position);
    });
    this.currentLocation$.pipe(startWith(this.location)).subscribe(r => {
      if (r) {
        const position = new google.maps.LatLng(r.longitude, r.latitude);
      }
    });
  }

  reset() {
    if (!this.location) {
      this.formGroup.patchValue({
        name: '',
        type: 'position',
        street: '',
        zipCode: '',
        city: '',
        longitude: '',
        latitude: ''
      });
    } else {
      this.formGroup.patchValue(
        {
          name: this.location.name,
          type: this.location.type,
          street: this.location.street,
          zipCode: this.location.zipCode,
          city: this.location.city,
          longitude: this.location.longitude,
          latitude: this.location.latitude
        },
        { emitEvent: true }
      );
    }
  }

  save() {
    const isRestaurant = this.type.value === 'restaurant';

    let location: Location = {
      id: this.location ? this.location.id : undefined,
      name: this.name.value,
      type: 'position',
      street: this.street.value ? this.street.value : undefined,
      zipCode: this.zipCode.value ? this.zipCode.value : undefined,
      city: this.city.value ? this.city.value : undefined,
      longitude: this.longitude.value,
      latitude: this.latitude.value
    };
    if (isRestaurant) {
      location = {
        ...location,
        type: 'restaurant',
        timelines: []
      };
    }

    this.store.dispatch(new ActionLocationSave(location));
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
