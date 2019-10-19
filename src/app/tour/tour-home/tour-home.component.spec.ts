import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourHomeComponent } from './tour-home.component';

describe('TourHomeComponent', () => {
  let component: TourHomeComponent;
  let fixture: ComponentFixture<TourHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
