import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeReportComponent } from './discharge-report.component';

describe('DischargeReportComponent', () => {
  let component: DischargeReportComponent;
  let fixture: ComponentFixture<DischargeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DischargeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
