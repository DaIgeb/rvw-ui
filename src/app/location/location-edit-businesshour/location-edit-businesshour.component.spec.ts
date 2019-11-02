import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEditBusinesshourComponent } from './location-edit-businesshour.component';

describe('LocationEditBusinesshourComponent', () => {
  let component: LocationEditBusinesshourComponent;
  let fixture: ComponentFixture<LocationEditBusinesshourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationEditBusinesshourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationEditBusinesshourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
