import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsebpSecondStageChartComponent } from './pulsebp-second-stage-chart.component';

describe('PulsebpSecondStageChartComponent', () => {
  let component: PulsebpSecondStageChartComponent;
  let fixture: ComponentFixture<PulsebpSecondStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PulsebpSecondStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulsebpSecondStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
