import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_ASYNC_VALIDATORS, ValidationErrors, AbstractControl, FormControl, Validators, NG_VALIDATORS } from '@angular/forms';
import { BusinessHour, Timeline } from '../location.model';
import * as moment from 'moment';

@Component({
  selector: 'rvw-location-edit-businesshour',
  templateUrl: './location-edit-businesshour.component.html',
  styleUrls: ['./location-edit-businesshour.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LocationEditBusinesshourComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: LocationEditBusinesshourComponent,
      multi: true
    },
  ]
})
export class LocationEditBusinesshourComponent implements OnInit, ControlValueAccessor, Validator {
  onTouched: any;
  from = new FormControl(undefined, [Validators.required]);
  until = new FormControl('', [Validators.required]);
  weekday = new FormControl('', [Validators.required]);

  formGroup = new FormGroup({
    from: this.from,
    until: this.until,
    weekday: this.weekday
  });

  weekdays = moment.weekdays();

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

  validate(control: AbstractControl): ValidationErrors {
    return this.formGroup.valid ? [] : this.formGroup.errors
  }

  writeValue(obj: BusinessHour): void {
    this.formGroup.patchValue({
      ...obj,
      from: obj.from ? moment(obj.from, 'HH:mm:ss').format('HH:mm') : undefined,
      until: obj.until ? moment(obj.until, 'HH:mm:ss').format('HH:mm') : undefined
    });
  }

  registerOnChange(fn) {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
}
