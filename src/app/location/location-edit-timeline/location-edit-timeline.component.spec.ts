import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEditTimelineComponent } from './location-edit-timeline.component';

describe('LocationEditTimelineComponent', () => {
  let component: LocationEditTimelineComponent;
  let fixture: ComponentFixture<LocationEditTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationEditTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationEditTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
