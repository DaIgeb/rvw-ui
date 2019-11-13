import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl, FormArray, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators, Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { ITimeline as Timeline } from 'rvw-model/lib/location';


@Component({
  selector: 'rvw-location-edit-timeline',
  templateUrl: './location-edit-timeline.component.html',
  styleUrls: ['./location-edit-timeline.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LocationEditTimelineComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: LocationEditTimelineComponent,
      multi: true
    },
  ]
})
export class LocationEditTimelineComponent implements OnInit, ControlValueAccessor, Validator {
  from = new FormControl('', [Validators.required]);
  until = new FormControl();
  phone = new FormControl();
  notes = new FormControl();
  businessHours = new FormArray([], [Validators.required, Validators.minLength(1)]);

  formGroup = new FormGroup({
    from: this.from,
    until: this.until,
    phone: this.phone,
    notes: this.notes,
    businessHours: this.businessHours
  }, []);
  onTouched: any;

  constructor() { }

  ngOnInit() {
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
    this.businessHours.clear();
    const businessHourItems = obj.businessHours ? obj.businessHours.length : 0;
    while (businessHourItems > this.businessHours.length) {
      this.addBusinessHour();
    }

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

  addBusinessHour() {
    this.businessHours.push(new FormControl(''));
  }
}
