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
import { switchMap, startWith, map } from 'rxjs/operators';
import { Tour } from '../tour.model';
import { ActivatedRoute } from '@angular/router';
import { ActionTourSave } from '../tour.actions';
import { Route } from '@app/core/route/route.model';
import { Member } from '@app/core/member/member.model';
import { selectRouteRoutes } from '@app/core/route/route.selectors';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { selectCurrentTourTours } from '../tour.selectors';

@Component({
  templateUrl: './tour-edit.component.html',
  styleUrls: ['./tour-edit.component.scss']
})
export class TourEditComponent implements OnInit, OnDestroy {
  private currenttourSubscription: Subscription;
  private tour: Tour;
  private routes: Route[];
  filteredRoutes: Observable<Route[]>;
  private members: Member[];
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
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(selectRouteRoutes))
      .subscribe(data => (this.routes = data));
    this.store
      .pipe(select(selectMemberMembers))
      .subscribe(data => (this.members = data));
    this.currenttourSubscription = this.tourSnapshot.paramMap
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
    this.currenttourSubscription.unsubscribe();
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
    if (!this.tour) {
      this.currentTourFormGroup.patchValue({
        date: new Date().toISOString(),
        route: '',
        points: 15,
        participants: []
      });
    } else {
      this.currentTourFormGroup.patchValue({
        date: this.tour.date,
        route: this.tour.route,
        points: this.tour.points,
        participants: this.tour.participants
      });
    }
  }

  addParticipant() {
    this.participants.push(this.createParticipant());
  }

  private createParticipant() {
    const formControl = new FormControl(undefined, Validators.required);

    this.filteredMembers.push(
      formControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      )
    );

    return new FormGroup({ id: formControl });
  }

  private _filter(value: string): Member[] {
    if (value.toLocaleLowerCase) {
      const filterValue = value.toLowerCase();

      return this.members.filter(
        option =>
          this.displayMember(option)
            .toLowerCase()
            .indexOf(filterValue) > -1
      );
    }

    return this.members;
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
      return `${args.firstName} ${args.lastName}`;
    }

    return '';
  }

  save() {
    this.store.dispatch(
      new ActionTourSave({
        id: this.tour ? this.tour.id : undefined,
        route: this.route.value,
        date: this.date.value,
        points: this.points.value,
        participants: this.participants.value
      })
    );
  }
}
