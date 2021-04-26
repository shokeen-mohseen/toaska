import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthStageMonitoringComponent } from './fourth-stage-monitoring.component';

describe('FourthStageMonitoringComponent', () => {
  let component: FourthStageMonitoringComponent;
  let fixture: ComponentFixture<FourthStageMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourthStageMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FourthStageMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
