import { TestBed } from '@angular/core/testing';

import { TourPlanerService } from './tour-planer.service';

describe('TourPlanerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TourPlanerService = TestBed.get(TourPlanerService);
    expect(service).toBeTruthy();
  });
});
