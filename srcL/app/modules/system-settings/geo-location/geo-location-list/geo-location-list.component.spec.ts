import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoLocationListComponent } from './geo-location-list.component';

describe('GeoLocationListComponent', () => {
  let component: GeoLocationListComponent;
  let fixture: ComponentFixture<GeoLocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoLocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
