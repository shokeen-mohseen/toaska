import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsebpThirdStageChartComponent } from './pulsebp-third-stage-chart.component';

describe('PulsebpThirdStageChartComponent', () => {
  let component: PulsebpThirdStageChartComponent;
  let fixture: ComponentFixture<PulsebpThirdStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PulsebpThirdStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulsebpThirdStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
