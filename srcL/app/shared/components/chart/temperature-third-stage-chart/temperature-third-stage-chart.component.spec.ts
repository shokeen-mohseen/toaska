import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureThirdStageChartComponent } from './temperature-third-stage-chart.component';

describe('TemperatureThirdStageChartComponent', () => {
  let component: TemperatureThirdStageChartComponent;
  let fixture: ComponentFixture<TemperatureThirdStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureThirdStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureThirdStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
