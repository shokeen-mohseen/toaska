import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentNaftaReportComponent } from './shipment-nafta-report.component';

describe('ShipmentNaftaReportComponent', () => {
  let component: ShipmentNaftaReportComponent;
  let fixture: ComponentFixture<ShipmentNaftaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentNaftaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentNaftaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
