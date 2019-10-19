import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { selectTourYear } from '../tour.selectors';
import { ActionTourSetYear } from '../tour.actions';
import { distinctUntilChanged, delay, first } from 'rxjs/operators';

@Component({
  selector: 'rvw-tour-home',
  templateUrl: './tour-home.component.html',
  styleUrls: ['./tour-home.component.scss']
})
export class TourHomeComponent implements OnInit {
  year = new FormControl(new Date().getFullYear(), { updateOn: 'blur' });
  formGroup = new FormGroup({
    year: this.year
  });

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectTourYear).pipe(first()).subscribe(year => {
      if (this.year.value !== year) {
        this.year.patchValue(year);
      }
    });
    this.year.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(v => {
        return this.store.dispatch(new ActionTourSetYear(v));
      });
  }

  save() {
    this.store.dispatch(new ActionTourSetYear(this.year.value));
  }
}
