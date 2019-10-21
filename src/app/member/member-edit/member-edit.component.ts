import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  ValidatorFn
} from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionMemberLoad,
  ActionMemberSave
} from '@app/core/member/member.actions';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Member } from '@app/core/member/member.model';
import { selectCurrentMemberMembers } from '@app/core/member/member.selectors';

@Component({
  selector: 'rvw-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  firstName = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  lastName = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);

  formGroup = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email
  });
  currentMember$: Observable<Member>;
  member: Member;

  constructor(
    private store: Store<AppState>,
    private tourSnapshot: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new ActionMemberLoad());

    this.currentMember$ = this.tourSnapshot.paramMap.pipe(
      switchMap(p =>
        this.store.pipe(select(selectCurrentMemberMembers(p.get('id'))))
      )
    );
    this.currentMember$.subscribe(r => {
      this.member = r;
      this.reset();
    });
  }

  reset() {
    if (!this.member) {
      this.formGroup.patchValue({
        firstName: '',
        lastName: '',
        email: ''
      });
    } else {
      this.formGroup.patchValue(
        {
          firstName: this.member.firstName,
          lastName: this.member.lastName,
          email: this.member.email
        },
        { emitEvent: true }
      );
    }
  }

  save() {
    this.store.dispatch(
      new ActionMemberSave({
        id: this.member ? this.member.id : undefined,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value
      })
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
}
