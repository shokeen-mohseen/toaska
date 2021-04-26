import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinAcetonVolumeSecondStageChartComponent } from './protein-aceton-volume-second-stage-chart.component';

describe('ProteinAcetonVolumeSecondStageChartComponent', () => {
  let component: ProteinAcetonVolumeSecondStageChartComponent;
  let fixture: ComponentFixture<ProteinAcetonVolumeSecondStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinAcetonVolumeSecondStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinAcetonVolumeSecondStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
