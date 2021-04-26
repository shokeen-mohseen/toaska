import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OxitocinActivePhaseChartComponent } from './oxitocin-active-phase.chart.component';

describe('OxitocinActivePhaseChartComponent', () => {
  let component: OxitocinActivePhaseChartComponent;
  let fixture: ComponentFixture<OxitocinActivePhaseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OxitocinActivePhaseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OxitocinActivePhaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
