import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedOrderReportComponent } from './planned-order-report.component';

describe('PlannedOrderReportComponent', () => {
  let component: PlannedOrderReportComponent;
  let fixture: ComponentFixture<PlannedOrderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannedOrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
