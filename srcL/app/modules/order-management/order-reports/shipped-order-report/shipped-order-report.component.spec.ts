import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippedOrderReportComponent } from './shipped-order-report.component';

describe('ShippedOrderReportComponent', () => {
  let component: ShippedOrderReportComponent;
  let fixture: ComponentFixture<ShippedOrderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippedOrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippedOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
