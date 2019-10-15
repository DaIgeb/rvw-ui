import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { MemberEffects } from './member.effects';

describe('MemberEffects', () => {
  let actions$: Observable<any>;
  let effects: MemberEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MemberEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(MemberEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
