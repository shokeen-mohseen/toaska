import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationActivityReportComponent } from './reservation-activity-report.component';

describe('ReservationActivityReportComponent', () => {
  let component: ReservationActivityReportComponent;
  let fixture: ComponentFixture<ReservationActivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationActivityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
