import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapForecastMaterialPanelComponent } from './map-forecast-material-panel.component';

describe('MapForecastMaterialPanelComponent', () => {
  let component: MapForecastMaterialPanelComponent;
  let fixture: ComponentFixture<MapForecastMaterialPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapForecastMaterialPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapForecastMaterialPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
