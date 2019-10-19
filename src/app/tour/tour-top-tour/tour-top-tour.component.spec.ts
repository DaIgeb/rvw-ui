import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourTopTourComponent } from './tour-top-tour.component';

describe('TourTopTourComponent', () => {
  let component: TourTopTourComponent;
  let fixture: ComponentFixture<TourTopTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourTopTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourTopTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
