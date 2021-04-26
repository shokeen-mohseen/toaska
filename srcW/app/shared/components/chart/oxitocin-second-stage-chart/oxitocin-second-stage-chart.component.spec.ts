import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OxitocinSecondStageChartComponent } from './oxitocin-second-stage-chart.component';

describe('OxitocinSecondStageChartComponent', () => {
  let component: OxitocinSecondStageChartComponent;
  let fixture: ComponentFixture<OxitocinSecondStageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OxitocinSecondStageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OxitocinSecondStageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
