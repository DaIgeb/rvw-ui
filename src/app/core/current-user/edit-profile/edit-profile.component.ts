import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';

import { AppState } from '@app/core';
import { selectProfileSubject } from '@app/core/auth/auth.selectors';
import { ActionCurrentUserRegister } from '../current-user.actions';
import { selectCurrentUser } from '../current-user.selectors';
import { User } from '../current-user.models';

@Component({
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfileComponent implements OnInit, OnDestroy {
  private subjectSubscription: Subscription;
  private subject: any;

  firstName = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  lastName = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);

  currentUserFormGroup = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email
  });
  private currentUserSubscription: Subscription;
  private currentUser: User;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {}

  ngOnInit() {
    this.subjectSubscription = this.store
      .pipe(select(selectProfileSubject))
      .subscribe(p => (this.subject = p));
    this.currentUserSubscription = this.store
      .pipe(select(selectCurrentUser))
      .subscribe(u => {
        this.currentUser = u;
        this.reset();
      });
  }

  ngOnDestroy(): void {
    this.subjectSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
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
    if (!this.currentUser) {
      this.currentUserFormGroup.patchValue({
        firstName: '',
        lastName: '',
        email: ''
      });
    } else {
      this.currentUserFormGroup.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      });
    }
  }

  register() {
    this.store.dispatch(
      new ActionCurrentUserRegister({
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
        sub: this.subject,
        roles: []
      })
    );
  }
}
