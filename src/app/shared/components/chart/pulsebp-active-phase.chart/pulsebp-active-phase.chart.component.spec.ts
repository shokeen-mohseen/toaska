import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsebpActivePhaseChartComponent } from './pulsebp-active-phase.chart.component';

describe('PulsebpActivePhaseChartComponent', () => {
  let component: PulsebpActivePhaseChartComponent;
  let fixture: ComponentFixture<PulsebpActivePhaseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PulsebpActivePhaseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulsebpActivePhaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
