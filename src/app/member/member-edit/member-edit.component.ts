import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
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
import * as moment from 'moment';

@Component({
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
  email = new FormControl('', [Validators.email]);
  address = new FormControl('', []);
  zipCode = new FormControl('', []);
  city = new FormControl('', []);
  gender = new FormControl('', []);
  memberships = new FormArray([]);

  formGroup = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    address: this.address,
    zipCode: this.zipCode,
    city: this.city,
    memberships: this.memberships,
    gender: this.gender
  });
  currentMember$: Observable<Member>;
  member: Member;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unknown', label: 'Unknown' }
  ];

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
    while (this.memberships.length !== 0) {
      this.memberships.removeAt(0);
    }

    if (!this.member) {
      this.formGroup.patchValue({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        zipCode: '',
        city: '',
        memberships: [],
        gender: 'unknown'
      });
    } else {
      while (this.memberships.length < this.member.membership.length) {
        this.memberships.push(this.createMembership());
      }

      this.formGroup.patchValue(
        {
          firstName: this.member.firstName,
          lastName: this.member.lastName,
          email: this.member.email,
          address: this.member.address,
          zipCode: this.member.zipCode,
          city: this.member.city,
          memberships: this.member.membership.map(ms => ({
            from: moment(ms.from),
            to: ms.to ? moment(ms.to) : undefined
          })),
          gender: this.member.gender
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
        email: this.email.value,
        address: this.address.value,
        zipCode: this.zipCode.value,
        city: this.city.value,
        gender: this.gender.value,
        membership: this.memberships.value.map(p => ({
          from: moment(p.from).format('YYYY-MM-DD'),
          to: p.to ? moment(p.to).format('YYYY-MM-DD') : undefined
        }))
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

  addMembership() {
    this.memberships.push(this.createMembership());
  }

  removeMembership(i: number) {
    this.memberships.removeAt(i);
  }

  private createMembership() {
    const from = new FormControl(undefined, [Validators.required]);
    const to = new FormControl(undefined);

    return new FormGroup({ from, to });
  }
}
