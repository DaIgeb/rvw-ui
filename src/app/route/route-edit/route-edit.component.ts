import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RouteState, Route } from '../route.model';
import { selectCurrentRouteRoutes } from '../route.selectors';
import { AppState } from '@app/core';
import { ActionRouteSave } from '../route.actions';
import { ActivatedRouteSnapshot, ParamMap, ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'rvw-route-edit',
  templateUrl: './route-edit.component.html',
  styleUrls: ['./route-edit.component.scss']
})
export class RouteEditComponent implements OnInit, OnDestroy {
  private currentRouteSubscription: Subscription;
  private route: Route;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  distance = new FormControl('', [
    Validators.required
  ]);
  elevation = new FormControl('', [Validators.required]);

  currentRouteFormGroup = new FormGroup({
    name: this.name,
    elevation: this.elevation,
    distance: this.distance
  });

  constructor(private store: Store<AppState>, private fb: FormBuilder, private routeSnapshot: ActivatedRoute) { }

  ngOnInit() {
    this.currentRouteSubscription = this.routeSnapshot.paramMap
      .pipe(switchMap(p => this.store.pipe(select(selectCurrentRouteRoutes(p.get('id'))))))
      .subscribe(r => {
        this.route = r;
        this.reset();
      });;
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
        firstName: '',
        lastName: '',
        email: ''
      });
    } else {
      this.currentRouteFormGroup.patchValue({
        name: this.route.name,
        distance: this.route.distance,
        elevation: this.route.elevation
      })
    }
  }

  save() {
    this.store.dispatch(
      new ActionRouteSave({
        name: this.name.value,
        elevation: this.elevation.value,
        distance: this.distance.value
      })
    );
  }
}
