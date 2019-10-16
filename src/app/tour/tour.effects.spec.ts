import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TourEffects } from './tour.effects';

describe('TourEffects', () => {
  let actions$: Observable<any>;
  let effects: TourEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TourEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(TourEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
