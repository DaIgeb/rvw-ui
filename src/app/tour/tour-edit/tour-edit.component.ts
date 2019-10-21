import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  ValidatorFn
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core';
import { switchMap, startWith, map, tap } from 'rxjs/operators';
import { Tour } from '../tour.model';
import { ActivatedRoute } from '@angular/router';
import { ActionTourSave, ActionTourLoad } from '../tour.actions';
import { Route } from '@app/core/route/route.model';
import { Member } from '@app/core/member/member.model';
import { selectRouteRoutes } from '@app/core/route/route.selectors';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { selectTourToursTour } from '../tour.selectors';
import { ActionMemberLoad } from '@app/core/member/member.actions';
import { ActionRouteLoad } from '@app/core/route/route.actions';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';

function arrayValidation(
  validationFn: (item: any) => boolean,
  minValidRows: number,
  maxInvalidRows: number
): ValidatorFn {
  return (control: FormArray): { [key: string]: any } | null => {
    const setParticipants = control.value.filter(v => validationFn(v)).length;
    const notSetParticipants = control.value.length - setParticipants;
    return setParticipants < minValidRows || notSetParticipants > maxInvalidRows
      ? { arrayValidation: { value: control.value } }
      : null;
  };
}

import * as moment from 'moment';

@Component({
  templateUrl: './tour-edit.component.html',
  styleUrls: ['./tour-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class TourEditComponent implements OnInit, OnDestroy {
  private currentTourSubscription: Subscription;
  private tour: Tour;
  private routes: Route[];
  private members: Member[];

  filteredRoutes: Observable<Route[]>;
  filteredMembers: Observable<Member[]>[] = [];
  pointsOptions = [15, 20, 40, 80, 150];

  route = new FormControl('', [Validators.required, Validators.minLength(3)]);
  date = new FormControl(moment(), [Validators.required]);
  points = new FormControl('', [Validators.required]);
  participants = new FormArray(
    [this.createParticipant()],
    arrayValidation(v => v.participant, 1, 1)
  );

  currentTourFormGroup = new FormGroup({
    route: this.route,
    date: this.date,
    points: this.points,
    participants: this.participants
  });

  constructor(
    private store: Store<AppState>,
    private tourSnapshot: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new ActionTourLoad());
    this.store.dispatch(new ActionMemberLoad());
    this.store.dispatch(new ActionRouteLoad());

    this.store
      .pipe(select(selectRouteRoutes))
      .subscribe(data => (this.routes = data));
    this.store
      .pipe(select(selectMemberMembers))
      .subscribe(data => (this.members = data));
    this.currentTourSubscription = this.tourSnapshot.paramMap
      .pipe(
        switchMap(p =>
          this.store.pipe(select(selectTourToursTour(p.get('id'))))
        )
      )
      .subscribe(r => {
        this.tour = r;
        this.reset();
      });

    this.filteredRoutes = this.route.valueChanges.pipe(
      startWith({}),
      map(filterValue => this.filterRoutes(filterValue))
    );
  }

  ngOnDestroy(): void {
    this.currentTourSubscription.unsubscribe();
  }

  getErrorMessage(formControl: FormControl) {
    return formControl.hasError('required')
      ? 'You must enter a value'
      : formControl.hasError('email')
      ? 'Not a valid email'
      : formControl.hasError('minlength')
      ? 'Requires at least ' + formControl.errors.minlength.requiredLength
      : formControl.hasError('arrayValidation')
      ? 'Requires at least one valid participant and not more than 1 invalid'
      : '';
  }

  participantSelected() {
    if (
      !this.participants.value.some(
        (v: { participant: Member }) => !v.participant
      )
    ) {
      this.addParticipant();
    }
  }

  reset() {
    if (!this.tour) {
      this.currentTourFormGroup.patchValue({
        date: moment(),
        route: '',
        points: 15,
        participants: []
      });
    } else {
      while (this.participants.length <= this.tour.participants.length) {
        this.participants.push(this.createParticipant());
      }
      this.currentTourFormGroup.patchValue(
        {
          date: moment(this.tour.date),
          route: this.routes.find(r => r.id === this.tour.route),
          points: this.tour.points,
          participants: this.tour.participants.map(p => ({
            participant: this.members.find(m => m.id === p)
          }))
        },
        { emitEvent: true }
      );
    }
  }

  addParticipant() {
    this.participants.push(this.createParticipant());
  }

  removeParticipant(i: number) {
    this.participants.removeAt(i);
    this.filteredMembers.splice(i, 1);
  }

  private createParticipant() {
    const formControl = new FormControl(undefined);

    this.filteredMembers.push(
      formControl.valueChanges
        .pipe(
          startWith({}),
          map(value => this.filterMembers(value))
        )
        .pipe(
          tap(arr =>
            arr.sort((a, b) =>
              this.displayMember(a).localeCompare(this.displayMember(b))
            )
          )
        )
    );

    return new FormGroup({ participant: formControl });
  }

  private isMember(obj: any): obj is Member {
    if (obj && (obj as Member).id) {
      return true;
    }

    return false;
  }

  private filterMembers(value: string): Member[] {
    let filterValue: string;
    if (!value) {
      filterValue = '';
    } else if (this.isMember(value)) {
      filterValue = this.displayMember(value).toLocaleLowerCase();
    } else if (value.toLocaleLowerCase) {
      filterValue = value.toLocaleLowerCase();
    }

    const alreadySelectedMembers = this.participants.value.map(p =>
      p.participant ? p.participant.id : undefined
    );

    return this.members.filter(
      option =>
        alreadySelectedMembers.indexOf(option.id) === -1 &&
        this.displayMember(option)
          .toLocaleLowerCase()
          .indexOf(filterValue) > -1
    );
  }

  private filterRoutes(value: string): Route[] {
    if (value.toLocaleLowerCase) {
      const filterValue = value.toLowerCase();

      return this.routes.filter(
        option =>
          this.displayRoute(option)
            .toLowerCase()
            .indexOf(filterValue) > -1
      );
    }

    return this.routes;
  }

  displayRoute(args: Route) {
    return args.name;
  }

  displayMember(args: Member) {
    if (args) {
      return `${args.lastName} ${args.firstName}`;
    }

    return '';
  }

  save() {
    this.store.dispatch(
      new ActionTourSave({
        id: this.tour ? this.tour.id : undefined,
        route: this.route.value.id,
        date: moment(this.date.value).format('YYYY-MM-DD'),
        points: this.points.value,
        participants: this.participants.value
          .filter(p => p.participant)
          .map(p => p.participant.id)
      })
    );
  }
}
