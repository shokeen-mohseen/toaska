import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComputationMethodComponent } from './map-computation-method.component';

describe('MapComputationMethodComponent', () => {
  let component: MapComputationMethodComponent;
  let fixture: ComponentFixture<MapComputationMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComputationMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComputationMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
