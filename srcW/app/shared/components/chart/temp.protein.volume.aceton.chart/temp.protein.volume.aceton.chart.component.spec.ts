import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempProteinVolumeAcetonChartComponent } from './temp.protein.volume.aceton.chart.component';

describe('TempProteinVolumeAcetonChartComponent', () => {
  let component: TempProteinVolumeAcetonChartComponent;
  let fixture: ComponentFixture<TempProteinVolumeAcetonChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempProteinVolumeAcetonChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempProteinVolumeAcetonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
