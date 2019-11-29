import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonEventsEditComponent } from './season-events-edit.component';

describe('SeasonEventsEditComponent', () => {
  let component: SeasonEventsEditComponent;
  let fixture: ComponentFixture<SeasonEventsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonEventsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonEventsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
