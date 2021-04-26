import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempratureActivePhaseChartComponent } from './temprature-active-phase.chart.component';

describe('TempratureActivePhaseChartComponent', () => {
  let component: TempratureActivePhaseChartComponent;
  let fixture: ComponentFixture<TempratureActivePhaseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempratureActivePhaseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempratureActivePhaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
