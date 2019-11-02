import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_ASYNC_VALIDATORS, ValidationErrors, AbstractControl, FormControl, Validators, NG_VALIDATORS } from '@angular/forms';
import { BusinessHour, Timeline } from '../location.model';

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
  from = new FormControl('', [Validators.required]);
  until = new FormControl('', [Validators.required]);
  weekday = new FormControl('', [Validators.required]);

  formGroup = new FormGroup({
    from: this.from,
    until: this.until,
    weekday: this.weekday
  });

  constructor() { }

  ngOnInit() {
  }


  validate(control: AbstractControl): ValidationErrors {
    return this.formGroup.valid ? [] : this.formGroup.errors
  }

  writeValue(obj: BusinessHour): void {
    this.formGroup.patchValue(obj, { emitEvent: false });
  }

  registerOnChange(fn) {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
}
