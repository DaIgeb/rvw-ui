import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectCurrentRouteRoutes } from '../../core/route/route.selectors';
import { AppState } from '@app/core';
import {
  ActivatedRoute
} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IDetail as Route } from 'rvw-model/lib/route';
import { ActionRouteSave } from '@app/core/route/route.actions';

@Component({
  selector: 'rvw-route-edit',
  templateUrl: './route-edit.component.html',
  styleUrls: ['./route-edit.component.scss']
})
export class RouteEditComponent implements OnInit, OnDestroy {
  private currentRouteSubscription: Subscription;
  private route: Route;

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  type = new FormControl('', [Validators.required]);
  distance = new FormControl('', [Validators.required]);
  elevation = new FormControl('', [Validators.required]);

  currentRouteFormGroup = new FormGroup({
    name: this.name,
    elevation: this.elevation,
    distance: this.distance
  });

  constructor(
    private store: Store<AppState>,
    private routeSnapshot: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentRouteSubscription = this.routeSnapshot.paramMap
      .pipe(
        switchMap(p =>
          this.store.pipe(select(selectCurrentRouteRoutes(p.get('id'))))
        )
      )
      .subscribe(r => {
        this.route = r;
        this.reset();
      });
  }

  ngOnDestroy(): void {
    this.currentRouteSubscription.unsubscribe();
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
    if (!this.route) {
      this.currentRouteFormGroup.patchValue({
        name: '',
        distance: '',
        elevation: ''
      });
    } else {
      this.currentRouteFormGroup.patchValue({
        name: this.route.name,
        distance: this.route.timelines[0].distance,
        elevation: this.route.timelines[0].elevation
      });
      this.name.patchValue(this.route.name);
    }
  }

  save() {
    this.store.dispatch(
      new ActionRouteSave({
        id: this.route ? this.route.id : undefined,
        name: this.name.value,
        type: this.type.value,
        timelines: [
          {
            from: '1900-01-01',
            elevation: this.elevation.value,
            distance: this.distance.value,
            locations: []
          }
        ]
      })
    );
  }
}
