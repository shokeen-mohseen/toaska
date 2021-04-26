import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapForecastComponent } from './map-forecast.component';

describe('MapForecastComponent', () => {
  let component: MapForecastComponent;
  let fixture: ComponentFixture<MapForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
