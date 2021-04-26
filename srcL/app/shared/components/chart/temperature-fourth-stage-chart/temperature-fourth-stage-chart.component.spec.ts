import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureFourthStageChartComponent } from './temperature-fourth-stage-chart.component';

describe('TemperatureFourthStageChartComponent', () => {
  let component: TemperatureFourthStageChartComponent;
  let fixture: ComponentFixture<TemperatureFourthStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureFourthStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureFourthStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
