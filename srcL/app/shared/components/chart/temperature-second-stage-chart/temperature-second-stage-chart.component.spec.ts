import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureSecondStageChartComponent } from './temperature-second-stage-chart.component';

describe('TemperatureSecondStageChartComponent', () => {
  let component: TemperatureSecondStageChartComponent;
  let fixture: ComponentFixture<TemperatureSecondStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureSecondStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureSecondStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
