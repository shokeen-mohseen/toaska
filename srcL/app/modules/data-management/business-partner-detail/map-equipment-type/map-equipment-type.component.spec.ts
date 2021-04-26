import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEquipmentTypeComponent } from './map-equipment-type.component';

describe('MapEquipmentTypeComponent', () => {
  let component: MapEquipmentTypeComponent;
  let fixture: ComponentFixture<MapEquipmentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapEquipmentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
