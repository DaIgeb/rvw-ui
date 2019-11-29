import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonEventEditComponent } from './season-event-edit.component';

describe('SeasonEventEditComponent', () => {
  let component: SeasonEventEditComponent;
  let fixture: ComponentFixture<SeasonEventEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonEventEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonEventEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
