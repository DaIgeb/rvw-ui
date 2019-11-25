import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDetailFilesComponent } from './route-detail-files.component';

describe('RouteDetailFilesComponent', () => {
  let component: RouteDetailFilesComponent;
  let fixture: ComponentFixture<RouteDetailFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteDetailFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteDetailFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
