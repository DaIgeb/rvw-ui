import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteEditTimelineComponent } from './route-edit-timeline.component';

describe('RouteEditTimelineComponent', () => {
  let component: RouteEditTimelineComponent;
  let fixture: ComponentFixture<RouteEditTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteEditTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteEditTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
