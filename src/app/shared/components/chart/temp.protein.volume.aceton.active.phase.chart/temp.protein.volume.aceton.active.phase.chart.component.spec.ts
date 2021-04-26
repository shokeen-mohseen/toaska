import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempProteinVolumeAcetonActivePhaseChartComponent } from './temp.protein.volume.aceton.active.phase.chart.component';

describe('TempProteinVolumeAcetonActivePhaseChartComponent', () => {
  let component: TempProteinVolumeAcetonActivePhaseChartComponent;
  let fixture: ComponentFixture<TempProteinVolumeAcetonActivePhaseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempProteinVolumeAcetonActivePhaseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempProteinVolumeAcetonActivePhaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
