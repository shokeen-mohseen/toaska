import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalPatientMonitoringComponent } from './critical-patient-monitoring.component';

describe('CriticalPatientMonitoringComponent', () => {
  let component: CriticalPatientMonitoringComponent;
  let fixture: ComponentFixture<CriticalPatientMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalPatientMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalPatientMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
