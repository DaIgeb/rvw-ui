import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  FormArray
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core';
import { switchMap, startWith, map, tap } from 'rxjs/operators';
import { Tour } from '../tour.model';
import { ActivatedRoute } from '@angular/router';
import { ActionTourSave } from '../tour.actions';
import { Route } from '@app/core/route/route.model';
import { Member } from '@app/core/member/member.model';
import { selectRouteRoutes } from '@app/core/route/route.selectors';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { selectCurrentTourTours } from '../tour.selectors';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from '@angular/material';

@Component({
  templateUrl: './tour-edit.component.html',
  styleUrls: ['./tour-edit.component.scss']
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
  date = new FormControl('', [Validators.required]);
  points = new FormControl('', [Validators.required]);
  participants = new FormArray([this.createParticipant()]);

  currentTourFormGroup = new FormGroup({
    route: this.route,
    date: this.date,
    points: this.points,
    participants: this.participants
  });

  constructor(
    private store: Store<AppState>,
    private tourSnapshot: ActivatedRoute
  ) { }

  ngOnInit() {
    this.store
      .pipe(select(selectRouteRoutes))
      .subscribe(data => (this.routes = data));
    this.store
      .pipe(select(selectMemberMembers))
      .subscribe(data => (this.members = data));
    this.currentTourSubscription = this.tourSnapshot.paramMap
      .pipe(
        switchMap(p =>
          this.store.pipe(select(selectCurrentTourTours(p.get('id'))))
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
          : '';
  }

  participantSelected() {
    console.log(this.participants.value);
    if (!this.participants.value.some(v => !v.participant)) {
      this.addParticipant();
    }
  }

  reset() {
    if (!this.tour) {
      this.currentTourFormGroup.patchValue({
        date: new Date().toISOString(),
        route: '',
        points: 15,
        participants: []
      });
    } else {
      while (this.participants.length <= this.tour.participants.length) {
        this.participants.push(this.createParticipant());
      }
      this.currentTourFormGroup.patchValue({
        date: this.tour.date,
        route: this.routes.find(r => r.id === this.tour.route),
        points: this.tour.points,
        participants: this.tour.participants.map(p => ({ participant: this.members.find(m => m.id === p) }))
      }, { emitEvent: true });
    }
  }

  addParticipant() {
    this.participants.push(this.createParticipant());
  }

  private createParticipant() {
    const formControl = new FormControl(undefined, Validators.required);

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
      filterValue = ''
    }
    else if (this.isMember(value)) {
      filterValue = this.displayMember(value).toLocaleLowerCase()
    }
    else if (value.toLocaleLowerCase) {
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
        date: (typeof this.date.value === 'string'
          ? this.date.value
          : this.date.value.toISOString()
        ).slice(0, 10),
        points: this.points.value,
        participants: this.participants.value.map(p => p.participant.id)
      })
    );
  }
}
