import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'rvw-season-event-edit',
  templateUrl: './season-event-edit.component.html',
  styleUrls: ['./season-event-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SeasonEventEditComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: SeasonEventEditComponent,
      multi: true
    },
  ]
})
export class SeasonEventEditComponent implements OnInit, ControlValueAccessor, Validator {
  name = new FormControl(undefined, [Validators.required]);
  from = new FormControl(undefined, [Validators.required]);
  until = new FormControl(undefined, [Validators.required]);
  location = new FormControl(undefined, [Validators.required]);
  organizer = new FormControl(undefined, [Validators.required]);

  formGroup = new FormGroup({
    name: this.name,
    from: this.from,
    until: this.until,
    location: this.location,
    organizer: this.organizer
  });
  onTouched: any;
  constructor() { }

  ngOnInit() {
  }

  writeValue(obj: any): void {
    this.formGroup.patchValue(obj);
  }

  registerOnChange(fn: any): void {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors {
    return this.formGroup.valid ? null : {
      form: {
        valid: false,
        message: 'Invalid'
      }
    };
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
