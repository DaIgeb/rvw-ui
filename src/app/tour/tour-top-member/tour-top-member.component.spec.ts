import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourTopMemberComponent } from './tour-top-member.component';

describe('TourTopMemberComponent', () => {
  let component: TourTopMemberComponent;
  let fixture: ComponentFixture<TourTopMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourTopMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourTopMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
