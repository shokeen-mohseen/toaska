import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationReportsComponent } from './location-reports.component';

describe('LocationReportsComponent', () => {
  let component: LocationReportsComponent;
  let fixture: ComponentFixture<LocationReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
