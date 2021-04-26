import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentShowDetailComponent } from './shipment-show-detail.component';

describe('ShipmentShowDetailComponent', () => {
  let component: ShipmentShowDetailComponent;
  let fixture: ComponentFixture<ShipmentShowDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentShowDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentShowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
