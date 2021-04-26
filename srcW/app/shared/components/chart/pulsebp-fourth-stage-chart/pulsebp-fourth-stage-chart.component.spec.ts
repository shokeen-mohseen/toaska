import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsebpFourthStageChartComponent } from './pulsebp-fourth-stage-chart.component';

describe('PulsebpFourthStageChartComponent', () => {
  let component: PulsebpFourthStageChartComponent;
  let fixture: ComponentFixture<PulsebpFourthStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PulsebpFourthStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulsebpFourthStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
