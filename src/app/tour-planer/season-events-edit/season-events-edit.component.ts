import { Component, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormGroup, AbstractControl, ValidationErrors, FormArray, FormControl, Validators } from '@angular/forms';
import { IEvent } from 'rvw-model/lib/season';

@Component({
  selector: 'rvw-season-events-edit',
  templateUrl: './season-events-edit.component.html',
  styleUrls: ['./season-events-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SeasonEventsEditComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: SeasonEventsEditComponent,
      multi: true
    },
  ]
})
export class SeasonEventsEditComponent implements OnInit, ControlValueAccessor, Validator {
  events = new FormArray([]);
  formGroup = new FormGroup({
    events: this.events
  }, []);
  onTouched: any;

  constructor() { }

  ngOnInit() {
  }

  writeValue(obj: any): void {
    this.events.patchValue(obj);
  }

  registerOnChange(fn: any): void {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.formGroup.valid ? null : {
      form: {
        valid: false,
        message: 'Invalid'
      }
    };
  }

  getEventTitle(args: IEvent) {
    return args.name;
  }

  addEvent(event?: IEvent) {
    
    this.events.push(new FormControl(''));
  }
}
