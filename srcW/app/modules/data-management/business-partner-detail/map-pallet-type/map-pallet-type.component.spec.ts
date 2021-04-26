import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPalletTypeComponent } from './map-pallet-type.component';

describe('MapPalletTypeComponent', () => {
  let component: MapPalletTypeComponent;
  let fixture: ComponentFixture<MapPalletTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPalletTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPalletTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
