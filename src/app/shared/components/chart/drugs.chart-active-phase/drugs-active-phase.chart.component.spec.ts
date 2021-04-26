import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsActivePhaseChartComponent } from './drugs-active-phase.chart.component';

describe('DrugsActivePhaseChartComponent', () => {
  let component: DrugsActivePhaseChartComponent;
  let fixture: ComponentFixture<DrugsActivePhaseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrugsActivePhaseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsActivePhaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
