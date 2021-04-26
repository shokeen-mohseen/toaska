import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPreferredMaterialsComponent } from './map-preferred-materials.component';

describe('MapPreferredMaterialsComponent', () => {
  let component: MapPreferredMaterialsComponent;
  let fixture: ComponentFixture<MapPreferredMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPreferredMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPreferredMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
